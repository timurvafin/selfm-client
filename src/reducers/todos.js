import * as Actions from '../actions/todos'
import {TASKS_RECEIVE} from '../actions/tasks'
import { makeOrderedMap } from '../utils/immutable'
import { fromJS } from 'immutable'

export default function (todos, action) {
    switch (action.type) {
        case TASKS_RECEIVE: {
            const todosAr = action.tasks.reduce((result, task) => [...result, ...task.todos], [])

            return todos.merge(makeOrderedMap(todosAr, 'id'))
        }
        case Actions.TODOS_ADD:
            return todos.set(action.fields.id, fromJS(action.fields))
        case Actions.TODOS_UPDATE:
            return todos.update(action.id, todo => todo.merge(fromJS(action.fields)))
        case Actions.TODOS_REMOVE:
            return todos.delete(action.id)
        /*case Actions.TODOS_TOGGLE:
         return todos.updateIn([action.fields.parent_id, 'todos'], task => task.merge(Map({completed: action.complete})))*/
        default:
            return todos
    }
}