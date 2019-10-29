/* eslint-disable arrow-body-style */
import { Map } from 'immutable';
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
import { RootState } from './index';


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

export const namespace = 'tasks';

export const actions = createActionCreators({
  create: (parentId?: ID, sectionId?: ID) => ({ parentId, sectionId }),
  add: (entity: TaskEntity) => ({ entity }),
  update: (id: ID, fields: Partial<TaskEntity>) => ({ id, fields }),
  remove: (id: ID) => ({ id }),
  load: (parentId: ID = undefined) => ({ parentId }),
  receive: (entities: EntitiesArray<TaskEntity>) => ({ entities }),
  move: (id: ID, parentId: ID) => ({ id, parentId }),
  reorder: (ids: Array<ID>) => ({ ids }),
  setSelected: (id: ID, value = true) => ({ id, value }),
  setOpen: (id: ID, value = true) => ({ id, value }),
  // todos
  createTodo: (parentId: ID) => ({ parentId }),
  addTodo: (entity: TodoEntity) => ({ entity }),
  updateTodo: (parentId, id: ID, fields: Partial<TodoEntity>) => ({ parentId, id, fields }),
  removeTodo: (parentId, id: ID) => ({ parentId, id }),
}, namespace);

const toggleId = (id, value, currentId) => {
  if (value) {
    return id;
  }

  return currentId === id ? null : currentId;
};

const spec: ModelSpec<TasksState, typeof actions> = {
  namespace,
  state: {
    entities: Map<ID, TaskEntity>(),
    ui: {
      openId: null,
      selectedId: null,
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
      setSelected: (state: TasksUIState, { id, value }) => {
        return { ...state, selectedId: toggleId(id, value, state.selectedId) };
      },
      setOpen: (state: TasksUIState, { id, value }) => {
        return { ...state, openId: toggleId(id, value, state.openId) };
      },
    }
  },
  effects: {
    load: function* (action) {
      const tasks = yield call(Api.list, action.parentId);

      yield put(actions.receive(tasks));
    },
    create: function* ({ parentId, sectionId }) {
      const baseEntity = createBaseEntity();
      const state: RootState = yield select();
      const siblings = state.tasks.entities.filter(task => task.parentId == parentId && task.sectionId == sectionId);

      yield put(actions.add({
        ...baseEntity,
        caption: '',
        parentId,
        sectionId,
        completed: false,
        tags: [],
        order: getNextOrder(siblings),
        todoList: [],
      }));

      yield put(actions.setOpen(baseEntity.id, true));
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
      const state: RootState = yield select();
      const targetChildren = state.tasks.entities.filter(task => task.parentId === parentId);
      const order = getNextOrder(targetChildren);

      yield put(actions.update(id, { parentId: parentId, order }));
    },
  },
};

export default spec;



