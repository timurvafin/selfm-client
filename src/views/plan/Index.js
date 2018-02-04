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

function mapStateToProps(state) {
    const allTodos = state.get('todos')

    return {
        tasks: state.get('tasks').map(task => {
            const todos = allTodos.filter(todo => todo.get('parent_id') === task.get('id'))

            return task.set('todos', todos.toList())
        }),
        projects: state.get('projects'),
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

