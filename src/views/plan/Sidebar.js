import React from 'react'
import cs from 'classnames'
import {NavLink} from 'react-router-dom'
import Icon from 'src/components/Icon'

class ProjectLink extends React.Component {
    render() {
        const {project, onClick} = this.props;

        const classname = cs('sidebar__project', {
            ['sidebar__project--selected']: project.selected
        });

        return <div onClick={onClick}  to={'/tm/project/' + project.id} key={project.id} className={classname}>
            <div className="sidebar__project__icon">{project.icon}</div>
            <div className="sidebar__project__name">{project.caption || project.placeholder}</div>
        </div>
    }
}

export default class extends React.Component {
    render() {
        const {projects, createProject} = this.props;

        return <div className="sidebar">
            <div className="sidebar__projects">
                { projects.map(project => {
                    return <ProjectLink key={project.id} onClick={this.props.openProject.bind(null, project.id)} project={project}/>
                })}
            </div>

            <div className="sidebar__actions">
                <div onClick={createProject} className="sidebar__action sidebar__action--add">
                    <Icon name="plus"/>
                    <span>Новый проект</span>
                </div>
            </div>
        </div>
    }
}

