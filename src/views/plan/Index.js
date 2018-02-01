import React from 'react'
import {connect} from 'react-redux'
import * as TaskActions from 'src/actions/tasks'
import * as ProjectActions from 'src/actions/projects'
import Sidebar from './Sidebar'
import WorkSpace from './WorkSpace'

import './style.scss'

class PlanView extends React.Component {
    componentDidMount() {
        const {loadProjects} = this.props;

        loadProjects();
    }

    render() {
        return <div className="plan">
            <Sidebar {...this.props}/>
            <WorkSpace {...this.props}/>
        </div>
    }
}

function mapStateToProps(state) {
    return {
        tasks: state.tasks || {},
        projects: state.projects || [],
    };
}

export default connect(mapStateToProps, {
    selectTask: TaskActions.select,
    openTask: TaskActions.open,
    createTask: TaskActions.create,
    createTodo: TaskActions.createTodo,
    removeTask: TaskActions.remove,
    updateTask: TaskActions.update,
    reorder: TaskActions.reorder,
    loadTasks: TaskActions.load,
    loadProjects: ProjectActions.load,
    setProjectSelected: ProjectActions.setSelected,
    openProject: ProjectActions.open,
    updateProject: ProjectActions.update,
    createProject: ProjectActions.create
})(PlanView)

