/* eslint-disable arrow-body-style */
import { List, Map } from 'immutable';
import {
  BaseEntity,
  BaseTaskEntity,
  createActionCreators,
  createBaseEntity,
  createUpdateEffect,
  EntitiesArray,
  EntitiesMap,
  entityBaseReducers,
  getNextOrder,
  ModelSpec,
  updateEntitiesOrder,
} from './common';
import { ID } from '../../common/types';
import { call, put, select } from '@redux-saga/core/effects';
import * as Api from '../../service/api';
import { ModelsState } from './index';
import { taskSelector, tasksSelector } from '../selectors';
import { workspaceActions, WorkspaceEntity } from './workspace';
import { Shortcut, WorkspaceTypes } from '../../common/constants';
import { isUndefined } from '../../common/utils/common';


export interface TodoEntity extends BaseEntity {
  id: ID;
  caption: string;
  completed: boolean;
}

export interface TaskEntity extends BaseTaskEntity {
  todoList: Array<TodoEntity>;
  tags: Array<string>;
}

export interface TodoEntity {
  id: ID;
  caption: string;
  completed: boolean;
}

export interface TasksUIState {
  openId?: ID;
  selectedId?: ID;
}

export type TasksState = {
  entities: EntitiesMap<TaskEntity>;
  ui: TasksUIState;
}

const namespace = 'tasks';

const actions = createActionCreators({
  create: (workspace?: WorkspaceEntity, sectionId?: ID) => ({ workspace, sectionId }),
  add: (entity: TaskEntity) => ({ entity }),
  update: (id: ID, fields: Partial<TaskEntity>) => ({ id, fields }),
  remove: (id: ID) => ({ id }),
  load: () => ({}),
  receive: (entities: EntitiesArray<TaskEntity>) => ({ entities }),
  move: (id: ID, destination: { parentId?: ID; sectionId?: ID; position?: number }) => ({ id, destination }),
  reorder: (ids: Array<ID>) => ({ ids }),
  setShortcut: (taskId: ID, shortcutCode: Shortcut) => ({ taskId, shortcutCode }),
  // todos
  createTodo: (parentId: ID) => ({ parentId }),
  addTodo: (entity: TodoEntity) => ({ entity }),
  updateTodo: (parentId, id: ID, fields: Partial<TodoEntity>) => ({ parentId, id, fields }),
  removeTodo: (parentId, id: ID) => ({ parentId, id }),
}, namespace);

const selectors = {
  siblings: (state: ModelsState, parentId?: ID, sectionId?: ID): EntitiesMap<TaskEntity> => {
    return state.tasks.entities.filter(task => task.parentId == parentId && task.sectionId == sectionId);
  },
};

const getEntityFields = (workspace: WorkspaceEntity) => {
  if (!workspace) {
    return {};
  }

  if (workspace.type === WorkspaceTypes.PROJECT) {
    return { parentId: workspace.code };
  }

  if (workspace.type === WorkspaceTypes.SHORTCUT) {
    const handlers = {
      [Shortcut.INBOX]: () => ({ startTime: null, startTimeTag: null, parentId: null }),
      [Shortcut.TODAY]: () => ({ startTime: Date.now(), startTimeTag: null }),
      [Shortcut.PLANS]: () => ({ startTime: Date.now() + 24 * 3600, startTimeTag: null }),
      [Shortcut.ANYTIME]: () => ({ startTimeTag: 'anytime', startTime: null }),
      [Shortcut.SOMEDAY]: () => ({ startTimeTag: 'someday', startTime: null }),
    };

    if (handlers[workspace.code]) {
      return handlers[workspace.code]();
    }
  }

  return {};
};

const spec: ModelSpec<TasksState, typeof actions> = {
  namespace,
  state: {
    entities: Map<ID, TaskEntity>(),
    ui: {},
  },
  actions,
  reducers: {
    entities: {
      ...entityBaseReducers,
      addTodo: (state: EntitiesMap<TaskEntity>, { entity }) => {
        return state.mergeIn([entity.id, 'todoList'], [entity]);
      },
      updateTodo: (state: EntitiesMap<TaskEntity>, { parentId, id, fields }) => {
        return state.mergeIn([parentId, 'todoList', id], fields);
      },
      removeTodo: (state: EntitiesMap<TaskEntity>, { parentId, id }) => {
        return state.deleteIn([parentId, 'todoList', id]);
      },
      reorder: (state: EntitiesMap<TaskEntity>, action) => {
        return updateEntitiesOrder(state, action.ids);
      },
    },
    ui: {},
  },
  effects: {
    load: function* () {
      const tasks: TaskEntity[] = yield call(Api.list, 'task');

      yield put(actions.receive(tasks));
    },
    create: function* ({ workspace, sectionId }) {
      const state: ModelsState = yield select();
      const workspaceTasks: Array<TaskEntity> = tasksSelector(state, workspace);
      const siblings = workspaceTasks.filter(task => task.sectionId == sectionId);

      const entityToAdd = {
        ...getEntityFields(workspace),
        caption: '',
        sectionId,
        completed: false,
        tags: [],
        order: getNextOrder(List(siblings)),
        todoList: [],
      };

      const entity: TaskEntity = yield call(Api.add, entityToAdd, 'task');
      yield put(actions.add(entity));
      yield put(workspaceActions.setTaskOpen(entity.id, true));
    },
    createTodo: function* ({ parentId }) {
      const baseEntity = createBaseEntity();

      yield put(actions.addTodo({
        ...baseEntity,
        caption: '',
        parentId,
        completed: false,
      }));
    },
    update: createUpdateEffect({
      namespace,
      addApi: Api.add,
      updateApi: Api.update,
      updateAction: actions.update,
    }),
    reorder: function* ({ ids }) {
      yield call(Api.reorder, ids);
    },
    remove: function* ({ id }) {
      yield call(Api.remove, id);
    },
    setShortcut: function* ({ taskId, shortcutCode }) {
      yield put(actions.update(taskId, getEntityFields({ code: shortcutCode, type: WorkspaceTypes.SHORTCUT })));
    },
    move: function* ({ id, destination: actionDestination }) {
      const task: TaskEntity = yield select(state => taskSelector(state, id));

      const destination = {
        parentId: isUndefined(actionDestination.parentId) ? task.parentId : actionDestination.parentId,
        sectionId: isUndefined(actionDestination.sectionId) ? task.sectionId : actionDestination.sectionId,
        position: actionDestination.position,
      };

      const targetSiblings: EntitiesMap<TaskEntity> = yield select(state => selectors.siblings(state, destination.parentId, destination.sectionId));

      if (actionDestination.position == null) {
        const order = getNextOrder(targetSiblings.toList());
        yield put(actions.update(id, { parentId: destination.parentId, sectionId: destination.sectionId, order }));
      } else {
        let siblingsList = targetSiblings.sortBy(task => task.order).toList();
        const sourceIndex = siblingsList.findIndex(task => task.id === id);

        if (sourceIndex !== -1) {
          siblingsList = siblingsList.delete(sourceIndex);
        }

        siblingsList = siblingsList.insert(actionDestination.position, task);
        const ids = siblingsList.map(task => task.id).toArray();

        // TODO [opt] update only suitable ids
        yield put(actions.reorder(ids));

        yield put(actions.update(id, { parentId: destination.parentId, sectionId: destination.sectionId }));
      }
    },
  },
};

export {
  namespace as tasksNamespace,
  actions as taskActions,
};

export default spec;



