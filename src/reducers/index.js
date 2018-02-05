import { Map, OrderedMap } from 'immutable'
import todoReducer from './todos'
import tasksReducer from './tasks'
import projectsReducer from './projects'

const initialState = Map({
    tasks: OrderedMap(),
    todos: OrderedMap(),
    projects: OrderedMap(),
})

export default function (state = initialState, action) {
    const todos    = todoReducer(state.get('todos'), action)
    const tasks    = tasksReducer(state.get('tasks'), todos, action)
    const projects = projectsReducer(state.get('projects'), tasks, action)

    return Map({
        todos,
        tasks,
        projects
    })
}