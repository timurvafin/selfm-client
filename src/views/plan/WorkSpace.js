import React from 'react'
import {OrderedMap} from 'immutable'
import {connect} from 'react-redux'
import Project from '../project/Project'

class WorkSpace extends React.Component {
    render() {
        const {project, children} = this.props
        const {projectActions, taskActions, todoActions} = this.props

        return <div className="workspace">
            {project ? <Project
                fields={project}
                tasks={children}
                taskActions={taskActions}
                todoActions={todoActions}
                remove={projectActions.remove.bind(null, project.get('id'))}
                update={projectActions.update.bind(null, project.get('id'))}
                toggle={projectActions.toggle.bind(null, project.get('id'))}
            /> : ''
            }
        </div>
    }
}

function mapStateToProps(state, props) {
    const project  = props.projects.find(project => project.get('open'))
    const children = project ? props.tasks.filter(task => task.get('parent_id') === project.get('id')) : OrderedMap()

    return {
        project,
        children: children.toList()
    }
}

export default connect(mapStateToProps)(WorkSpace)

