import * as Api from '../../service/api';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as UI from '../actions/sections';
import {
  SECTIONS_LOAD,
  SECTIONS_CREATE,
  SECTIONS_UPDATE,
  SECTIONS_REMOVE,
} from '../actions/sections';
import { createEntity } from './common';


function* load() {
  const sections = yield call(Api.loadSections);

  yield put(UI.receive(sections));
}

function* update(action) {
  const { id, fields } = action;
  const state = yield select();
  const section = state.sections.entities.find(section => section.id === id);

  if (section.isNew) {
    yield put(UI.update(id, { isNew: false }));
    yield call(Api.addSection, { ...section, ...fields });
  } else {
    yield call(Api.updateSection, id, fields);
  }
}

function* remove(id) {
  yield call(Api.removeSection, id);
}

export default function* () {
  yield takeEvery(SECTIONS_LOAD, load);
  yield takeEvery(SECTIONS_CREATE, createEntity, UI.add);
  yield takeEvery(SECTIONS_UPDATE, update);
  yield takeEvery(SECTIONS_REMOVE, remove);
}