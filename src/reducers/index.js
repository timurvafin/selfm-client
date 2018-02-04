import {List, Map, OrderedMap} from 'immutable'
import {combineReducers} from 'redux'
import todoReducer from './todos'
import tasksReducer from './tasks'
import projectsReducer from './projects'

const initialState = Map({
    tasks: OrderedMap(),
    todos: OrderedMap(),
    projects: OrderedMap(),
})

export default function (state = initialState, action) {
    return Map({
        projects: projectsReducer(state.get('projects'), action),
        tasks: tasksReducer(state.get('tasks'), action),
        todos: todoReducer(state.get('todos'), action)
    })
}