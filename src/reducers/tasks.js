import * as Actions from '../actions/tasks'
import { Map, List } from 'immutable'
import { map } from '../utils/immutable'

const defaultTaskFields = Map({
    caption: '',
    open: false,
    selected: false,
    progress: 0,
    todos: List()
})

export default function (tasks, todos, action) {
    switch (action.type) {
        case Actions.TASKS_RECEIVE:
            return tasks.merge(action.payload)
        case Actions.TASKS_ADD:
            return tasks.set(action.payload.id, defaultTaskFields.merge(Map(action.payload)))
        case Actions.TASKS_UPDATE:
            return tasks.update(action.id, task => task.merge(Map(action.fields)))
        case Actions.TASKS_REMOVE:
            return tasks.delete(action.id)
        case Actions.TASKS_TOGGLE:
            return tasks.update(action.id, task => task.merge(Map({
                completed: action.complete,
            })))
        // view
        case Actions.TASKS_SET_OPEN:
            return map(tasks, task => Map({
                open: action.id === task.get('id') && action.open,
            }), true)
        default:
            return tasks
    }
}