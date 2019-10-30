/* eslint-disable arrow-body-style */
import { Map, List } from 'immutable';
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
import { tasksSelector } from '../selectors';
import { workspaceActions, WorkspaceEntity } from './workspace';
import { Shortcuts, WorkspaceTypes } from '../../common/constants';


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
  move: (id: ID, parentId: ID) => ({ id, parentId }),
  reorder: (ids: Array<ID>) => ({ ids }),
  // todos
  createTodo: (parentId: ID) => ({ parentId }),
  addTodo: (entity: TodoEntity) => ({ entity }),
  updateTodo: (parentId, id: ID, fields: Partial<TodoEntity>) => ({ parentId, id, fields }),
  removeTodo: (parentId, id: ID) => ({ parentId, id }),
}, namespace);

const getEntityFields = (workspace: WorkspaceEntity) => {
  if (!workspace) {
    return {};
  }

  if (workspace.type === WorkspaceTypes.PROJECT) {
    return { parentId: workspace.id };
  }

  if (workspace.type === WorkspaceTypes.SHORTCUT) {
    const handlers = {
      [Shortcuts.TODAY]: () => ({ startTime: Date.now() }),
      [Shortcuts.PLANS]: () => ({ startTime: Date.now() + 24 * 3600 }),
      [Shortcuts.ANYTIME]: () => ({ startTimeTag: 'anytime', startTime: null }),
      [Shortcuts.SOMEDAY]: () => ({ startTimeTag: 'someday', startTime: null }),
    };

    if (handlers[workspace.id]) {
      return handlers[workspace.id]();
    }
  }

  return {};
};

const spec: ModelSpec<TasksState, typeof actions> = {
  namespace,
  state: {
    entities: Map<ID, TaskEntity>(),
    ui: {

    },
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
    ui: {

    }
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
    reorder: function* (action) {
      yield call(Api.reorder, action.ids);
    },
    remove: function* (id) {
      yield call(Api.remove, id);
    },
    move: function* (action) {
      const { id, parentId } = action;
      const state: ModelsState = yield select();
      const targetChildren = state.tasks.entities.filter(task => task.parentId === parentId);
      const order = getNextOrder(targetChildren.toList());

      yield put(actions.update(id, { parentId: parentId, order }));
    },
  },
};

export {
  namespace as tasksNamespace,
  actions as taskActions,
};

export default spec;



