import * as Api from '../service/api'
import { takeEvery, put, call, select } from 'redux-saga/effects'
import * as UI from '../actions/projects'
import { receive as receiveTasks } from '../actions/tasks'
import { createEntity } from './common'
import { Map } from 'immutable'

function* load() {
    const projects = yield call(Api.loadProjects)

    yield put(UI.receive(projects))
    yield put(UI.open(100))
}

function* open(action) {
    const tasks = yield call(Api.loadTasks, action.id)

    yield put(receiveTasks(tasks))
}

function* update(action) {
    const {id, fields} = action
    const state   = yield select()
    const project = state.get('projects').find(project => project.get('id') === id)

    if (project.get('_new')) {
        const fieldsToAdd = project.delete('_new').delete('id').merge(Map(fields)).toJS()
        /*const newProject  = */yield call(Api.add, fieldsToAdd)
        //yield put(UI.updateSucceeded(id, newProject))
    } else {
        /*const updatedProject = */yield call(Api.update, id, fields)
        //yield put(UI.updateSucceeded(id, updatedProject))
    }
}

export default function*() {
    yield takeEvery(UI.PROJECTS_LOAD, load)
    yield takeEvery(UI.PROJECTS_CREATE, createEntity, UI.add)
    yield takeEvery(UI.PROJECTS_OPEN, open)
    yield takeEvery(UI.PROJECTS_UPDATE, update)
}