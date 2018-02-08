import React from 'react'
import classnames from 'classnames'
import Action from 'src/components/action'
import { stopPropagationAnd } from 'src/utils/component'
import TextField from 'src/components/textfield'
import Checkbox from 'src/components/checkbox'
import TodoList from './TodoList'
import onClickOutside from 'react-onclickoutside'
import EditableField from 'src/components/textfield/editable'

@onClickOutside
class Task extends React.Component {
    constructor(props) {
        super(props)

        this.onClick = this.setOpen.bind(this, true)
    }

    update(field, value) {
        this.props.update({[field]: value})
    }

    onTextFieldValueChange(name, value) {
        const prevValue = this.props[name]

        if (prevValue !== value) {
            this.update(name, value)
        }
    }

    setOpen(open = true) {
        if (this.props.isOpen !== open) {
            this.props.setOpen(open)
        }
    }

    // for HOC onClickOutside
    handleClickOutside() {
        if (this.props.isOpen) {
            this.setOpen(false)
        }
    }

    renderCaptionRow() {
        const {isOpen, completed, caption, isNew, toggle, connectDragPreview} = this.props

        return connectDragPreview(
            <div className="task__row task__row--caption">
                <Checkbox
                    onClick={e => e.stopPropagation()}
                    onValueChange={toggle}
                    tabIndex={-1}
                    className="task__checkbox"
                    checked={completed}
                />

                <EditableField
                    text={caption}
                    edit={isOpen}
                    tabIndex={-1}
                    className="task__caption"
                    autoFocus={isNew}
                    onValueChange={this.onTextFieldValueChange.bind(this, 'caption')}
                />
            </div>
        )
    }

    render() {
        const {connectDragSource, isDragging, canDrag, connectDropTarget, style} = this.props
        const {remove, todoActions} = this.props
        const {id, todos, completed, notes, editable, isOpen, selected} = this.props

        const classNames = classnames('task', {
            ['task--completed']: completed,
            ['task--editable']: editable,
            ['task--open']: isOpen,
            ['task--selected']: selected,
            ['task--dragging']: isDragging,
            ['task--can-drag']: canDrag,
        })
                    
        return connectDragSource(connectDropTarget(<div className={classNames} onClick={this.onClick} style={style}>
            {this.renderCaptionRow()}

            <div className="task__row task__row--details">
                <TextField
                    multiline={true}
                    text={notes}
                    className="task__notes"
                    placeholder="Заметки"
                    onValueChange={this.onTextFieldValueChange.bind(this, 'notes')}
                />
            </div>

            <div className="task__row task__row--details">
                <TodoList todos={todos} actions={todoActions} createTodo={todoActions.create.bind(null, id)} />
            </div>

            <div className="task__row task__row--controls">
                <div className="task__controls">
                    <Action icon="list-items" hoverClr="blue" action={todoActions.create.bind(null, id)}
                            title="Add todo" />
                    <Action icon="calendar" hoverClr="orange" title="Calendar" />
                    <Action icon="tag" hoverClr="yellow" title="Tag" />
                    <Action icon="remove" hoverClr="red"
                            action={stopPropagationAnd(remove)} title="Remove" />
                </div>
            </div>
            
            <div className="task__drag-placeholder"></div>
        </div>))
    }
}

export default Task