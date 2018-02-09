import { takeEvery, call, select } from 'redux-saga/effects'
import * as UI from '../actions/todos'
import { createEntity } from './common'
import * as Api from '../service/api'
import { Map } from 'immutable'

function* remove(id) {
    yield call(Api.remove, id)
}

function* update({id, fields}) {
    const state = yield select()
    const todo  = state.get('todos').get(id)

    if (todo.get('isNew')) {
        /*const newTodo = */
        yield call(Api.add, todo.delete('isNew').delete('id').merge(Map(fields)).toJS())
    } else {
        /*const updatedTodo = */
        yield call(Api.update, id, fields)
    }
}

export default function* tasksSaga() {
    yield takeEvery(UI.TODOS_CREATE, createEntity, UI.add)
    yield takeEvery(UI.TODOS_REMOVE, remove)
    yield takeEvery(UI.TODOS_UPDATE, update)
}