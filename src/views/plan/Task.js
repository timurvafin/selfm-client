import React from 'react'
import classnames from 'classnames'
import TextArea from 'react-textarea-autosize'
import Icon from 'src/components/Icon'
import TextField from 'src/components/TextField'
import Checkbox from 'src/components/Checkbox'
import TodoList from './TodoList'
import {ENTER_KEY} from 'src/utils/common'
import {wrapOnKeyDown} from 'src/utils/component'

export default class extends React.Component {
    onRemoveClick(e) {
        e.stopPropagation();

        this.props.remove();
    }

    onInputChange(name, value, e) {
        const prevValue = this.props[name];
        const {update} = this.props;

        if (prevValue !== value) {
            update({[name]: value})
        }
    }

    focus() {
        this.taskNode.focus();
    }

    onBlur(e) {
        const currentTarget = e.currentTarget;

        // хак, иначе при фокусе внутренних элементов снималось выделение с родиетеля
        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                this.props.unselect();
            }
        }, 0);
    }

    render() {
        const {toggle, setEditable, select, open, unselect, createTodo} = this.props;
        const {index, id, todos, caption, completed, notes, editable, isOpen, selected} = this.props;

        const classNames = classnames('task', {
            ['task--completed']: completed,
            ['task--editable']: editable,
            ['task--open']: isOpen,
            ['task--selected']: selected,
        });

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
                    onChange={toggle}
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
                <TodoList todos={todos} createTodo={createTodo}
                />
            </div>

            <div className="task__row task__row--details">
                <div className="task__controls">
                    <Icon name="layout-list-thumb" hoverClr="blue" onClick={createTodo}/>
                    <Icon name="calendar" hoverClr="orange"/>
                    <Icon name="tag" hoverClr="yellow"/>
                    <Icon name="close" hoverClr="red" onClick={this.onRemoveClick.bind(this)}/>
                </div>
            </div>
        </div>
    }
}

