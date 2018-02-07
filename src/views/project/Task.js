import React from 'react'
import classnames from 'classnames'
import Action from 'src/components/action'
import { stopPropagationAnd } from 'src/utils/component'
import TextField from 'src/components/textfield'
import Checkbox from 'src/components/checkbox'
import TodoList from './TodoList'
import onClickOutside from 'react-onclickoutside'
import EditableField from 'src/components/textfield/editable'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'

const taskSource = {
    beginDrag(props) {
        console.log(props)
        return {
            id: props.id,
            index: props.index
        }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
        canDrag: monitor.canDrag()
    }
}

const taskTarget = {
    hover(props, monitor, component) {
        const dragIndex  = monitor.getItem().index
        const hoverIndex = props.index

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
        }

        // Time to actually perform the action
        props.move(dragIndex, hoverIndex)

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex
    },
}

@DropTarget('TASK', taskTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource('TASK', taskSource, collect)
@onClickOutside
class Task extends React.Component {
    update(field, value) {
        this.props.update({[field]: value})
    }

    onTextFieldValueChange(name, value) {
        const prevValue = this.props[name]

        if (prevValue !== value) {
            this.update(name, value)
        }
    }

    // for HOC onClickOutside
    handleClickOutside() {
        if (this.props.isOpen) {
            this.props.unselect()
        }
    }

    renderCaptionRow() {
        const {isOpen, completed, caption, isNew, toggle, connectDragPreview} = this.props

        return (
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
        const {connectDragSource, isDragging, canDrag, connectDropTarget} = this.props
        const {open, remove, todoActions} = this.props
        const {id, todos, completed, notes, editable, isOpen, selected} = this.props

        const classNames = classnames('task', {
            ['task--completed']: completed,
            ['task--editable']: editable,
            ['task--open']: isOpen,
            ['task--selected']: selected,
            ['task--dragging']: isDragging,
            ['task--can-drag']: canDrag,
        })
                    
        return connectDragSource(connectDropTarget(<div className={classNames} onClick={open}>
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