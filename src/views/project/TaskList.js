import React from 'react'
import TaskListItem from './Task'

export default class TaskList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            ids: props.tasks.map(task => task.get('id'))
        }
        
        this.moveTask = this.moveTask.bind(this)
    }

    componentWillReceiveProps(props) {
        this.setState({ids: props.tasks.map(task => task.get('id'))})
    }

    moveTask(fromIndex, toIndex) {
        const fromId = this.state.ids.get(fromIndex)

        this.setState({ids: this.state.ids.delete(fromIndex).insert(toIndex, fromId)})
    }

    render() {
        const {tasks, actions, todoActions} = this.props

        const taskDataList = this.state.ids.map((id, index) => {
            const task = tasks.find(task => task.get('id') === id)
            
            const props = {
                index,
                id,
                completed: task.get('completed'),
                caption: task.get('caption'),
                editable: task.get('editable'),
                isOpen: task.get('open'),
                isNew: task.get('_new'),
                selected: task.get('selected'),
                notes: task.get('notes'),
                todos: task.get('todos'),
                
                setEditable: actions.update.bind(null, id, {editable: !task.get('editable')}, false),
                toggle: actions.toggle.bind(null, id),
                remove: actions.remove.bind(null, id),
                update: actions.update.bind(null, id),
                select: actions.select.bind(null, id, true),
                unselect: actions.select.bind(null, id, false),
                open: task.get('open') ? null : actions.open.bind(null, id),
                
                todoActions: {
                    create: todoActions.create.bind(null, id),
                    update: todoActions.update,
                    remove: todoActions.remove,
                }
            }

            return <TaskListItem key={id} move={this.moveTask} {...props}/>
        }).toJS()

        return <div className="task-list">
            {taskDataList}
        </div>
    }
}