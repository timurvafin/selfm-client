import React from 'react'
import TaskList from './TaskList'
import {ENTER_KEY} from 'src/utils/common'
import TextField from 'src/components/TextField'
import Checkbox from 'src/components/Checkbox'
import Action from 'src/components/Action'
import PropTypes from 'prop-types'

import './project.scss'

export default class extends React.Component {
    update(field, value) {
        this.props.update({
            [field]: value,
        })
    }

    render() {
        const {fields, children, taskActions, todoActions} = this.props

        return <div className="project">
            <div className="project__row project__row--caption">
                <Checkbox
                    checked={fields.get('completed')}
                    onValueChange={this.update.bind(this, 'completed')}
                    className="project__checkbox"
                />

                <TextField
                    placeholder="Название"
                    onValueChange={this.update.bind(this, 'caption')}
                    className="project__name"
                    text={fields.get('caption')}
                />
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
                <TaskList actions={taskActions} todoActions={todoActions} tasks={children}/>
            </div>

            <div className="project__row project__row--actions">
                <Action action={taskActions.create.bind(null, fields.get('id'))} className="project__action" icon="plus" name="Новая задача"/>
            </div>
        </div>
    }
}