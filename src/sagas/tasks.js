import * as Api from '../service/api'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import {randomString} from 'src/utils/common'
import * as UI from '../actions/tasks'
import {Map} from 'immutable'

function* create(action) {
    const tempId = randomString()

    yield put(UI.add({
        id: tempId,
        parent_id: action.parentId,
        _new: true
    }))

    yield put(UI.open(tempId))
}

function* update({id, fields}) {
    const state = yield select()
    const task  = state.get('tasks').get(id)

    if (task.get('_new')) {
        /*const newTask = */yield call(Api.add, task.delete('_new').delete('id').merge(Map(fields)).toJS())
        //yield put(UI.updateSucceeded(id, newTask))
    } else {
        /*const updatedTask = */yield call(Api.update, id, fields)
        //yield put(UI.updateSucceeded(id, updatedTask))
    }
}

function* remove(id) {
    yield call(Api.remove, id)
}

export default function* tasksSaga() {
    yield takeEvery(UI.TASKS_CREATE, create)
    yield takeEvery(UI.TASKS_UPDATE, update)
    //yield takeEvery(UI.TASKS_OPEN, open)
    //yield takeEvery(UI.TASKS_TOGGLE, toggle)
    yield takeEvery(UI.TASKS_REMOVE, remove)
}