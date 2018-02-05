import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ProjectActions from 'src/actions/projects'
import * as TaskActions from 'src/actions/tasks'
import * as TodoActions from 'src/actions/todos'
import Sidebar from './Sidebar'
import WorkSpace from './WorkSpace'

import './style.scss'

class PlanView extends React.Component {
    componentDidMount() {
        const {load} = this.props.projectActions

        load()
    }

    render() {
        return <div className="plan">
            <Sidebar {...this.props}/>
            <WorkSpace {...this.props}/>
        </div>
    }
}

const todosProgress = todos => {
    return todos && todos.size > 0 ? (todos.filter(todo => todo.get('completed')).size / todos.size) : 0
}

const calcProgress = (task, complete, todos) => {
    return complete ? 1 : todosProgress(todos)
}

function mapStateToProps(state) {
    const allTodos = state.get('todos')
    const allTasks = state.get('tasks')

    return {
        tasks: allTasks.map(task => {
            const todos = allTodos.filter(todo => todo.get('parent_id') === task.get('id'))
            const progress = calcProgress(task, task.get('completed', todos))

            return task.set('todos', todos.toList()).set('progress', progress)
        }),
        projects: state.get('projects').map(project => {
            const tasks = allTasks.filter(task => task.get('parent_id') === project.get('id'))
            const progress = tasks.size <= 0 ? 0 : (tasks.reduce((sum, task) => {
                return sum + (task.get('completed') ? 1 : 0)
            }, 0) / tasks.size * 100)

            return project.set('progress', progress)
        }),
    }
}

function mapDispatchToProps(dispatch) {
    const projectActions = bindActionCreators(ProjectActions, dispatch)
    const taskActions    = bindActionCreators(TaskActions, dispatch)
    const todoActions    = bindActionCreators(TodoActions, dispatch)

    return {
        projectActions,
        taskActions,
        todoActions
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanView)

