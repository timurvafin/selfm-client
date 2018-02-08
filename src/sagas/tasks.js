import * as Api from '../service/api'
import { takeEvery, put, call, select } from 'redux-saga/effects'
import { randomString } from 'src/utils/common'
import * as UI from '../actions/tasks'
import { TASKS_LOADED } from '../actions/tasks'
import { Map } from 'immutable'
import { makeOrderedMap } from '../utils/immutable'

const toTaskEntity = (task) => {
    return task.delete('todos')
}

function fetchTodos(tasks) {
    const todosAr = tasks.reduce((result, task) => [...result, ...task.get('todos')], [])

    return makeOrderedMap(todosAr, 'id')
}

function* receive({payload}) {
    const entities = makeOrderedMap(payload, 'id')
    const todos    = fetchTodos(entities)

    yield put(UI.receive(todos))
    yield put(UI.receive(entities.map(toTaskEntity)))
}

function* create(action) {
    const tempId = randomString()

    yield put(UI.add({
        id: tempId,
        parent_id: action.parentId,
        completed: false,
        _new: true
    }))

    yield put(UI.open(tempId))
}

function* update({id, fields}) {
    const state = yield select()
    const task  = state.get('tasks').get(id)

    if (task.get('_new')) {
        yield call(Api.add, task.delete('_new').delete('id').merge(Map(fields)).toJS())
    } else {
        yield call(Api.update, id, fields)
    }
}

function* toggle({id, complete}) {
    yield* update({id, fields: {completed: complete}})
}

function* reorder(action) {
    const state      = yield select()
    const itemsOrder = action.order

    const tasks = state.get('tasks').filter(task => itemsOrder.includes(task.get('id'))).map(task => {
        const order = itemsOrder.keyOf(task.get('id'))

        return typeof order !== 'undefined' ? task.set('order', order + 1) : task
    })

    yield put(UI.receive(tasks))
}

function* remove(id) {
    yield call(Api.remove, id)
}

export default function* tasksSaga() {
    yield takeEvery(TASKS_LOADED, receive)
    yield takeEvery(UI.TASKS_CREATE, create)
    yield takeEvery(UI.TASKS_UPDATE, update)
    yield takeEvery(UI.TASKS_TOGGLE, toggle)
    yield takeEvery(UI.TASKS_REMOVE, remove)
    yield takeEvery(UI.TASKS_REORDER, reorder)
}