import React from 'react'
import {List, Map, OrderedMap} from 'immutable'
import {connect} from 'react-redux'
import {ENTER_KEY, findInArray} from 'src/utils/common'
import Project from './Project'
import {Route, withRouter} from 'react-router-dom'
import _ from 'lodash/fp'

class WorkSpace extends React.Component {
    render() {
        const {project, children, updateProject} = this.props
        const {projectActions, taskActions, todoActions} = this.props

        return <div className="workspace">
            {project ? <Project
                fields={project}
                children={children}
                taskActions={taskActions}
                todoActions={todoActions}
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

export default withRouter(connect(mapStateToProps)(WorkSpace))

