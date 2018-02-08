import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import Task from './Task'

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
        canDrag: monitor.canDrag()
    }
}

const taskSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index
        }
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

    drop(props) {
        props.saveOrder()
    }
}

const Draggable = DragSource('TASK', taskSource, collect)

const Droppable = DropTarget('TASK', taskTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))

const withDND = (Task) => {
    return Droppable(Draggable(Task))
}

export default withDND(Task)
