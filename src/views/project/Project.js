import React, { Component } from 'react'
import TaskList from './TaskList'
import EditableField from 'src/components/textfield/editable'
import TextField from 'src/components/textfield'
import Action from 'src/components/action'
import RadialProgressBar from 'src/components/radial-progress-bar'
import ProjectMenu from './ProjectMenu'

import './project.scss'

export default class Project extends Component {
    update(field, value) {
        this.props.update({
            [field]: value,
        })
    }

    render() {
        const {remove, fields, tasks, taskActions, todoActions} = this.props
        const addTask = taskActions.create.bind(null, fields.get('id'))

        const menuItems = [
            {action: '', name: 'Complete', icon: 'check'},
            {action: addTask, name: 'Add task', icon: 'add'},
            {action: remove, name: 'Remove', icon: 'remove', className: 'project__action--remove'},
        ]
        
        return <div className="project">
            <div className="project__row project__row--caption">
                <RadialProgressBar
                    className="project__progress-bar"
                    size="20"
                    progress={fields.get('progress')}
                    color="#cd3d82"
                    bg="#fafafa"
                />

                <EditableField
                    placeholder="Название"
                    textFieldClass="project__name project__name--textfield"
                    captionClass="project__name"
                    onValueChange={this.update.bind(this, 'caption')}
                    text={fields.get('caption')}
                    edit={fields.get('_new')}
                />

                <ProjectMenu items={menuItems} />
            </div>

            <div className="project__row">
                <TextField
                    multiline={true}
                    placeholder="Заметки"
                    onValueChange={this.update.bind(this, 'notes')}
                    className="project__notes"
                    text={fields.get('notes')}
                />
            </div>

            <div className="project__row">
                <TaskList actions={taskActions} todoActions={todoActions} tasks={tasks}/>
            </div>

            <div className="project__row project__row--actions">
                <Action action={addTask} className="project__action" icon="plus" name="Новая задача"/>
            </div>
        </div>
    }
}