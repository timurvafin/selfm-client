import * as Actions from '../actions/tasks'
import * as TodoActions from '../actions/todos'
import {updateListItemById, map, makeOrderedMap} from '../utils/immutable'
import _ from 'lodash/fp'
import {List, Map, fromJS} from 'immutable'

const defaultTaskFields = Map({
    caption: '',
    open: false,
    selected: false,
})

export default function (tasks = Map({}), action) {
    switch (action.type) {
        case Actions.TASKS_RECEIVE:
            return tasks.merge(makeOrderedMap(action.tasks, 'id').map(task => task.delete('todos')))
        case Actions.TASKS_ADD:
            const newFields = defaultTaskFields.merge(Map(action.fields))    
            
            return tasks.set(action.fields.id, newFields)
        case Actions.TASKS_UPDATE:
            return tasks.update(action.id, task => task.merge(Map(action.fields)))
        case Actions.UPDATE_SUCCEEDED:
            return tasks.update(action.id, task => Map(action.task))
        case Actions.TASKS_REMOVE:
            return tasks.delete(action.id)
        case Actions.TASKS_TOGGLE:
            return tasks.update(action.id, task => task.merge(Map({completed: action.complete})))
        case Actions.TASKS_REORDER:
            return tasks
        // view
        case Actions.TASKS_SELECT:
            return map(tasks, task => Map({
                selected: action.id === task.get('id') && action.select,
                open: action.id === task.get('id') && !action.select ? false : task.get('open')
            }), true)
        case Actions.TASKS_OPEN:
            return map(tasks, task => Map({
                open: action.id === task.get('id'),
            }), true)
        case Actions.SET_EDITABLE:
            return map(tasks, task => Map({editable: action.editable}), true)
        default:
            return tasks
    }
}