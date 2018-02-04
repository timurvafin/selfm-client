import { takeEvery, put, call, select } from 'redux-saga/effects'
import * as UI from '../actions/todos'
import { TASKS_RECEIVE } from '../actions/tasks'
import { createEntity } from './common'
import * as Api from '../service/api'
import { Map } from 'immutable'

function* remove(id) {
    yield call(Api.remove, id)
}

function* receiveTasks(action) {
    const todos = action.tasks.reduce((result, task) => [...result, ...task.todos], [])

    yield put(UI.receive(todos))
}

function* update({id, fields}) {
    const state = yield select()
    const todo  = state.get('todos').get(id)

    if (todo.get('_new')) {
        /*const newTodo = */
        yield call(Api.add, todo.delete('_new').delete('id').merge(Map(fields)).toJS())
    } else {
        /*const updatedTodo = */
        yield call(Api.update, id, fields)
    }
}

export default function* tasksSaga() {
    yield takeEvery(UI.TODOS_CREATE, createEntity, UI.add)
    yield takeEvery(UI.TODOS_REMOVE, remove)
    yield takeEvery(UI.TODOS_UPDATE, update)
    yield takeEvery(TASKS_RECEIVE, receiveTasks)
}