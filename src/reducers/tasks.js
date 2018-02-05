import * as Actions from '../actions/tasks'
import { Map, List } from 'immutable'
import { makeOrderedMap, map } from '../utils/immutable'

const defaultTaskFields = Map({
    caption: '',
    open: false,
    selected: false,
    progress: 0,
    todos: List()
})

const toTaskEntity = (task) => {
    //const progress = calcProgress(task, task.get('completed'), task.get('todos'))

    return task/*.set('progress', progress)*/.delete('todos')
}

export default function (tasks, todos, action) {
    switch (action.type) {
        case Actions.TASKS_RECEIVE:
            return tasks.merge(makeOrderedMap(action.tasks, 'id').map(toTaskEntity))
        case Actions.TASKS_ADD:
            return tasks.set(action.fields.id, defaultTaskFields.merge(Map(action.fields)))
        case Actions.TASKS_UPDATE:
            return tasks.update(action.id, task => task.merge(Map(action.fields)))
        case Actions.TASKS_REMOVE:
            return tasks.delete(action.id)
        case Actions.TASKS_TOGGLE:
            return tasks.update(action.id, task => task.merge(Map({
                completed: action.complete,
                //progress: calcProgress(task, action.complete, todos.filter(todo => todo.get('parent_id') === task.get('id')))
            })))
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
            return map(tasks, () => Map({editable: action.editable}), true)
        default:
            return tasks
    }
}