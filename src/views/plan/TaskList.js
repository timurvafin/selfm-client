import React from 'react'
import TaskListItem from './Task'
import DraggableList from 'react-draggable-list'
import _ from 'lodash/fp'

export default class extends React.Component {
    render() {
        const {tasks} = this.props;

        const taskDataList = tasks.map((task, index) => {
            const props = {
                index,
                completed: task.completed,
                caption: task.caption,
                editable: task.editable,
                isOpen: task.open,
                selected: task.selected,
                notes: task.notes,
                todos: task.todos,
                createTodo: this.props.createTodo.bind(null, task.id),
                setEditable: this.props.updateTask.bind(null, task.id, {editable: !task.editable}, false),
                toggle: this.props.updateTask.bind(null, task.id, {completed: !task.completed}),
                remove: this.props.removeTask.bind(null, task.id),
                update: this.props.updateTask.bind(null, task.id),
                select: this.props.selectTask.bind(null, task.id, true),
                unselect: this.props.selectTask.bind(null, task.id, false),
                open: this.props.openTask.bind(null, task.id),
            };

            return <TaskListItem key={index} {...props}/>
        });

        return <div className="task-list" ref={cont => this.container=cont}>
            {taskDataList}
            {/*<DraggableList
                itemKey="index"
                padding={0}
                template={TaskListItem}
                list={taskDataList}
                onMoveEnd={newList => this.props.reorder(newTasks)}
                container={() => this.container}
                />*/}
        </div>;
    }
}