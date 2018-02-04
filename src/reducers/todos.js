import * as Actions from '../actions/todos'
import { makeOrderedMap } from '../utils/immutable'
import { fromJS } from 'immutable'

/*const defaultTaskFields = Map({
 caption: '',
 open: false,
 selected: false,
 })*/

export default function (todos, action) {
    switch (action.type) {
        case Actions.TODOS_RECEIVE:
            return todos.merge(makeOrderedMap(action.payload, 'id'))
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