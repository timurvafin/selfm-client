/* eslint-disable arrow-body-style */
import { Map } from 'immutable';
import {
  BaseEntity,
  BaseTaskEntity,
  createActionCreators,
  createBaseEntity,
  EntitiesMap,
  createBaseEntityReducers,
  getNextOrder,
  ModelSpec, createBaseEntityEffects, createBaseEntityActions,
} from './common';
import { ID } from '../common/types';
import { call, put, select } from '@redux-saga/core/effects';
import Api from '../service/api';
import { ModelsState } from './index';
import { workspaceTasksSelector, taskSelector } from '../store/selectors';
import { workspaceActions, WorkspaceEntity } from './workspace';
import { Shortcut, WorkspaceTypes } from '../common/constants';
import { isUndefined } from '../common/utils/common';


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
const taskApi = new Api(namespace);

const actions = createActionCreators({
  ...createBaseEntityActions<TaskEntity>(),
  create: (workspace?: WorkspaceEntity, sectionId?: ID) => ({ workspace, sectionId }),
  move: (id: ID, destination: { parentId?: ID; sectionId?: ID; position?: number }) => ({ id, destination }),
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
      [Shortcut.INBOX]: () => ({ startTime: null, startTimeTag: null, parentId: null, sectionId: null }),
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
      ...createBaseEntityReducers<TaskEntity>(),
      addTodo: (state: EntitiesMap<TaskEntity>, { entity }) => {
        return state.mergeIn([entity.id, 'todoList'], [entity]);
      },
      updateTodo: (state: EntitiesMap<TaskEntity>, { parentId, id, fields }) => {
        return state.mergeIn([parentId, 'todoList', id], fields);
      },
      removeTodo: (state: EntitiesMap<TaskEntity>, { parentId, id }) => {
        return state.deleteIn([parentId, 'todoList', id]);
      },
    },
    ui: {},
  },
  effects: {
    ...createBaseEntityEffects<TaskEntity>(namespace, actions),
    create: function* ({ workspace, sectionId }) {
      const state: ModelsState = yield select();
      const workspaceTasks: EntitiesMap<TaskEntity> = workspaceTasksSelector(state, workspace);
      const siblings = workspaceTasks.filter(task => task.sectionId == sectionId);

      const entityToAdd = {
        ...getEntityFields(workspace),
        caption: '',
        sectionId,
        completed: false,
        tags: [],
        order: getNextOrder(siblings.toList()),
        todoList: [],
      };

      const entity: TaskEntity = yield call(taskApi.add, entityToAdd);
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



