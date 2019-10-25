import * as Api from '../../service/api';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as UI from '../actions/projects';
import {
  PROJECTS_LOAD,
  PROJECTS_CREATE,
  PROJECTS_OPEN,
  PROJECTS_UPDATE,
  PROJECTS_REMOVE,
} from '../actions/projects';
import { load as loadTasks } from '../actions/tasks';
import { createEntity } from './common';
import { State } from '../index';


function* load() {
  const projects = yield call(Api.list);

  yield put(UI.receive(projects));
  yield put(UI.open(projects[0].id));
}

function* open(action) {
  const state: State = yield select();
  const project = state.projects.entities.find(({ id }) => action.id === id);

  if (!project.isNew) {
    yield put(loadTasks(action.id));
  }
}

function* update(action) {
  const { id, fields } = action;
  const state = yield select();
  const project = state.projects.entities.find(project => project.id === id);

  if (project.isNew) {
    yield put(UI.update(id, { isNew: false }));
    yield call(Api.add, { ...project, ...fields });
  } else {
    yield call(Api.update, id, fields);
  }
}

function* remove(id) {
  yield call(Api.remove, id);
}

export default function* () {
  yield takeEvery(PROJECTS_LOAD, load);
  yield takeEvery(PROJECTS_CREATE, createEntity, UI.add);
  yield takeEvery(PROJECTS_OPEN, open);
  yield takeEvery(PROJECTS_UPDATE, update);
  yield takeEvery(PROJECTS_REMOVE, remove);
}