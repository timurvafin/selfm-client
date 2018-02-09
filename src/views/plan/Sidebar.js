import React from 'react'
import cs from 'classnames'
import Action from 'src/components/action'
import RadialProgressBar from 'src/components/radial-progress-bar'
import { DropTarget } from 'react-dnd'

const projectTarget = {
    drop(props, monitor) {
        props.moveTask(monitor.getItem().id, props.project.get('id'))
    }
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}

@DropTarget('TASK', projectTarget, collect)
class ProjectLink extends React.Component {
    render() {
        const {connectDropTarget, isOver} = this.props
        const {project, onClick} = this.props

        const classname = cs('sidebar__project', {
            ['sidebar__project--selected']: project.get('selected'),
            ['sidebar__project--task-over']: isOver,
        })

        return connectDropTarget(<div onClick={onClick} className={classname} >
            <RadialProgressBar 
                size="15" 
                progress={project.get('progress')} 
                color="#aaa" 
                className="sidebar__project__progress-bar"
            />

            <div className="sidebar__project__icon">{project.get('icon')}</div>
            <div className="sidebar__project__name">{project.get('caption') || project.get('placeholder')}</div>
        </div>)
    }
}

export default class Sidebar extends React.Component {
    render() {
        const {projects, projectActions, taskActions} = this.props

        return <div className="sidebar">
            <div className="sidebar__projects">
                { projects.map((project) => {
                    return <ProjectLink moveTask={taskActions.move} key={project.get('id')} onClick={projectActions.open.bind(null, project.get('id'))} project={project}/>
                }).toList().toJS() }
            </div>

            <div className="sidebar__actions">
                <Action name="Новый проект" icon="plus" action={projectActions.create} className="sidebar__action sidebar__action--add" />
            </div>
        </div>
    }
}

