import React from 'react'
import { Map } from 'immutable'
import cs from 'classnames'
import { DragLayer } from 'react-dnd'
import DNDTask from './DNDTask'

@DragLayer(monitor => ({
    isDragging: monitor.isDragging()
}))
export default class TaskList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            indexes: this.makeIndexes(props)
        }

        this.moveTask = this.moveTask.bind(this)
    }

    makeIndexes(props) {
        return props.tasks.reduce((map, task, index) => map.set(task.get('id'), index), Map())
    }

    componentWillReceiveProps(props) {
        this.setState({
            indexes: this.makeIndexes(props)
        })
    }

    moveTask(fromIndex, toIndex) {
        const fromId = this.state.indexes.keyOf(fromIndex)
        const toId   = this.state.indexes.keyOf(toIndex)

        const delta   = fromIndex < toIndex ? -1 : 1
        const indexes = this.state.indexes.set(fromId, toIndex).set(toId, toIndex + delta)

        this.setState({
            indexes
        })
    }

    saveOrder() {
        this.props.actions.reorder(this.state.indexes.sort().keySeq())
    }

    render() {
        const {tasks, actions, todoActions, isDragging} = this.props

        const taskDataList = tasks.map((task, beforeAnimationIndex) => {
            //const task = tasks.find(task => task.get('id') === id)
            const id = task.get('id')

            const animationIndex = this.state.indexes.get(id)
            const props          = {
                index: animationIndex,
                id,
                completed: task.get('completed'),
                caption: task.get('caption'),
                editable: task.get('editable'),
                isOpen: task.get('open'),
                isNew: task.get('isNew'),
                selected: task.get('selected'),
                notes: task.get('notes'),
                todos: task.get('todos'),

                setEditable: actions.update.bind(null, id, {editable: !task.get('editable')}, false),
                toggle: actions.toggle.bind(null, id),
                remove: actions.remove.bind(null, id),
                update: actions.update.bind(null, id),
                setOpen: actions.setOpen.bind(null, id),

                todoActions: {
                    create: todoActions.create.bind(null, id),
                    update: todoActions.update,
                    remove: todoActions.remove,
                }
            }

            const coeff = animationIndex - beforeAnimationIndex
            return <DNDTask
                key={id}
                style={{transform: `translate3d(0, ${coeff * 31}px, 0)`}}
                move={this.moveTask}
                saveOrder={this.saveOrder.bind(this)} {...props}
            />
        }).toJS()

        const cls = cs('task-list', {
            ['task-list--dragging']: isDragging
        })

        return <div className={cls}>
            {taskDataList}
        </div>
    }
}