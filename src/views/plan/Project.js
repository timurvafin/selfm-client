import React from 'react'
import TextArea from 'react-textarea-autosize'
import TaskList from './TaskList'
import {ENTER_KEY} from 'src/utils/common'
import TextField from 'src/components/TextField'
import Checkbox from 'src/components/Checkbox'
import Action from 'src/components/Action'

import './project.scss'

export default class extends React.Component {
    updateProject(field, value) {
        this.props.update(this.props.id, {
            [field]: value,
        })
    }

    render() {
        const {caption, notes, children, addTask} = this.props;

        return <div className="project">
            <div className="project__row project__row--caption">
                <Checkbox defaultChecked={true} className="project__checkbox"/>

                <TextField
                    placeholder="Название"
                    onValueChange={this.updateProject.bind(this, 'caption')}
                    className="project__name"
                    text={caption}
                />
            </div>

            <div className="project__row">
                <TextField
                    multiline={true}
                    placeholder="Заметки"
                    onValueChange={this.updateProject.bind(this, 'notes')}
                    className="project__notes"
                    text={notes}
                />
            </div>

            <div className="project__row">
                <TaskList {...this.props} tasks={children}/>
            </div>

            <div className="project__row project__row--actions">
                <Action action={addTask} className="project__action" icon="plus" name="Новая задача"/>
            </div>
        </div>
    }
}