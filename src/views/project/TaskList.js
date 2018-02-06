import React from 'react'
import TaskListItem from './Task'

export default class TaskList extends React.Component {
    render() {
        const {tasks, actions, todoActions} = this.props

        const taskDataList = tasks.map((task, index) => {
            const taskId = task.get('id')
            
            const props = {
                index,
                id: taskId,
                completed: task.get('completed'),
                caption: task.get('caption'),
                editable: task.get('editable'),
                isOpen: task.get('open'),
                isNew: task.get('_new'),
                selected: task.get('selected'),
                notes: task.get('notes'),
                todos: task.get('todos'),
                
                setEditable: actions.update.bind(null, taskId, {editable: !task.get('editable')}, false),
                toggle: actions.toggle.bind(null, taskId),
                remove: actions.remove.bind(null, taskId),
                update: actions.update.bind(null, taskId),
                select: actions.select.bind(null, taskId, true),
                unselect: actions.select.bind(null, taskId, false),
                open: task.get('open') ? null : actions.open.bind(null, taskId),
                
                todoActions: {
                    create: todoActions.create.bind(null, taskId),
                    update: todoActions.update,
                    remove: todoActions.remove,
                }
            }

            return <TaskListItem key={index} {...props}/>
        }).toJS()

        return <div className="task-list">
            {taskDataList}
        </div>
    }
}