import React from 'react'
import classnames from 'classnames'
//import TextArea from 'react-textarea-autosize'
import Icon from 'src/components/Icon'
import TextField from 'src/components/TextField'
import Checkbox from 'src/components/Checkbox'
import TodoList from './TodoList'
//import {ENTER_KEY} from 'src/utils/common'
import {wrapOnKeyDown} from 'src/utils/component'

export default class Task extends React.Component {
    onRemoveClick(e) {
        e.stopPropagation()

        this.props.remove()
    }
    
    update(field, value) {
        this.props.update({[field]: value})
    }

    onInputChange(name, value) {
        const prevValue = this.props[name]

        if (prevValue !== value) {
            this.update(name, value)
        }
    }

    focus() {
        this.taskNode.focus()
    }

    onBlur(e) {
        const currentTarget = e.currentTarget

        // хак, иначе при фокусе внутренних элементов снималось выделение с родиетеля
        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                this.props.unselect()
            }
        }, 0)
    }

    wrapStopPropagation(fn) {
        return function (e) {
            e.stopPropagation()

            fn(e)
        }
    }

    render() {
        const {open, todoActions} = this.props
        const {id, todos, caption, completed, notes, editable, isOpen, selected, isNew} = this.props
                             
        const classNames = classnames('task', {
            ['task--completed']: completed,
            ['task--editable']: editable,
            ['task--open']: isOpen,
            ['task--selected']: selected,
        })

        return <div
            tabIndex={0}
            onBlur={this.onBlur.bind(this)}
            ref={taskNode => this.taskNode = taskNode}
            className={classNames}
            onKeyDown={wrapOnKeyDown(null, this.focus.bind(this), this.focus.bind(this))}
            onClick={open}
            >

            <div className="task__row task__row--caption">
                <Checkbox
                    onClick={e => e.stopPropagation()}
                    onValueChange={this.update.bind(this, 'completed')}
                    readOnly={!isOpen}
                    tabIndex={-1}
                    className="task__checkbox"
                    checked={completed}
                />

                <TextField
                    text={caption}
                    readOnly={!isOpen}
                    tabIndex={-1}
                    className="task__caption"
                    autoFocus={isNew}
                    onValueChange={this.onInputChange.bind(this, 'caption')}
                />
            </div>

            <div className="task__row task__row--details">
                <TextField
                    multiline={true}
                    text={notes}
                    className="task__notes"
                    placeholder="Заметки"
                    onValueChange={this.onInputChange.bind(this, 'notes')}
                />
            </div>

            <div className="task__row task__row--details">
                <TodoList todos={todos} actions={todoActions} createTodo={todoActions.create.bind(null, id)}/>
            </div>

            <div className="task__row task__row--controls">
                <div className="task__controls">
                    <Icon name="layout-list-thumb" hoverClr="blue" onClick={todoActions.create.bind(null, id)} title="Add todo"/>
                    <Icon name="calendar" hoverClr="orange" title="Calendar"/>
                    <Icon name="tag" hoverClr="yellow" title="Tag"/>
                    <Icon name="close" hoverClr="red" onClick={this.wrapStopPropagation(this.onRemoveClick.bind(this))} title="Remove"/>
                </div>
            </div>
        </div>
    }
}