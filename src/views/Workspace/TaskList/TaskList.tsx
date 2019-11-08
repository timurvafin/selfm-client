import React from 'react';
import cs from 'classnames';
import { TaskUIEntity } from 'store/selectors';
import Task, { DraggableTask } from '../Task';
import './tasks.scss';


export interface Props {
  tasks: Array<TaskUIEntity>;
  orderBy?: string;
  droppable?: boolean;
}

const TasksList = ({ tasks, orderBy, droppable }: Props) => {
  const cls = cs('task-list', {
  });

  if (orderBy) {
    tasks = tasks.sort((a, b) => a[orderBy] - b[orderBy]);
  }

  const TaskComponent = droppable ? DraggableTask : Task;

  return (
    <div className={cls}>
      {tasks.map((task, index) => (
        <TaskComponent
          key={task.id}
          task={task}
          index={index}
        />
      ))}
    </div>
  );
};

export default TasksList;