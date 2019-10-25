import * as Api from '../../service/api';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { randomString } from 'common/utils/common';
import * as UI from '../actions/tasks';
import {
  TASKS_LOAD,
  TASKS_MOVE,
  TASKS_CREATE,
  TASKS_UPDATE,
  TASKS_REMOVE,
  TASKS_REORDER,
  TASKS_CREATE_TODO,
} from '../actions/tasks';


function* load(action) {
  const tasks = yield call(Api.list, action.parentId);

  yield put(UI.receive(tasks));
}

function* create(action) {
  const tempId = randomString();

  yield put(UI.add({
    id: tempId,
    parentId: action.parentId,
    sectionId: action.sectionId,
    completed: false,
    tags: [],
    todoList: [],
    isNew: true,
  }));

  yield put(UI.setOpen(tempId, true));
}

function* createTodo(action) {
  const tempId = randomString();

  yield put(UI.addTodo(action.taskId, {
    id: tempId,
    caption: '',
    completed: false,
    isNew: true,
  }));
}

function* update(action) {
  const { id, values } = action;
  const state = yield select();
  const task = state.tasks.entities.find(task => task.id === id);

  if (task.isNew) {
    yield call(Api.add, { ...task, ...values });
    yield put(UI.update(id, { isNew: false }));
  } else {
    yield call(Api.update, id, values);
  }
}

function* reorder(action) {
  yield call(Api.reorder, action.ids);
}

function* remove(id) {
  yield call(Api.remove, id);
}

function* move(action) {
  const { id, parentId } = action;
  const state = yield select();
  const targetChildren = state.tasks.entities.filter(task => task.parentId === parentId);
  const order = targetChildren.size > 0 ? (targetChildren.maxBy(task => task.order).get('order') + 1) : 1;

  yield put(UI.update(id, { parentId: parentId, order }));
}

export default function* tasksSaga() {
  yield takeEvery(TASKS_LOAD, load);
  yield takeEvery(TASKS_MOVE, move);
  yield takeEvery(TASKS_CREATE, create);
  yield takeEvery(TASKS_CREATE_TODO, createTodo);
  yield takeEvery(TASKS_UPDATE, update);
  yield takeEvery(TASKS_REMOVE, remove);
  yield takeEvery(TASKS_REORDER, reorder);
}