import * as Api from '../service/api'
import { takeEvery, put, call, select } from 'redux-saga/effects'
import { randomString } from 'src/utils/common'
import * as UI from '../actions/tasks'
import { TASKS_LOADED, TASKS_LOAD, loaded } from '../actions/tasks'
import * as TodosUI from '../actions/todos'
import { Map, List } from 'immutable'
import { toOrderedMap } from '../utils/immutable'

const toTaskEntity = (task) => {
    return task.delete('todos')
}

function fetchTodos(tasks) {
    const todoList = tasks.reduce((result, task) => result.concat(task.get('todos')), List())
    
    return todoList.reduce((map, todo) => map.set(todo.get('id'), todo), Map())
}

function* load(action) {
    const tasks = yield call(Api.loadTasks, action.parentId)

    yield put(loaded(tasks))
}

function* receive({payload}) {
    const entities = toOrderedMap(payload, 'id')
    const todos    = fetchTodos(entities)

    yield put(TodosUI.receive(todos))
    yield put(UI.receive(entities.map(toTaskEntity)))
}

function* create(action) {
    const tempId = randomString()

    yield put(UI.add({
        id: tempId,
        parent_id: action.parentId,
        completed: false,
        isNew: true
    }))

    yield put(UI.open(tempId))
}

function* update({id, fields}) {
    const state = yield select()
    const task  = state.get('tasks').get(id)

    if (task.get('isNew')) {
        yield call(Api.add, task.delete('isNew').delete('id').merge(Map(fields)).toJS())
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

function* move({id, parentId}) {
    const state  = yield select()
    const targetChildren = state.get('tasks').filter(task => task.get('parent_id') === parentId)
    const order = targetChildren.size > 0 ? (targetChildren.maxBy(task => task.order).get('order') + 1) : 1

    yield put(UI.update(id, {parent_id: parentId, order}))
}

export default function* tasksSaga() {
    yield takeEvery(TASKS_LOAD, load)
    yield takeEvery(TASKS_LOADED, receive)
    yield takeEvery(UI.TASKS_MOVE, move)
    yield takeEvery(UI.TASKS_CREATE, create)
    yield takeEvery(UI.TASKS_UPDATE, update)
    yield takeEvery(UI.TASKS_TOGGLE, toggle)
    yield takeEvery(UI.TASKS_REMOVE, remove)
    yield takeEvery(UI.TASKS_REORDER, reorder)
}