import React from 'react';
import cs from 'classnames';
import Task from './Task';
import { TaskUIEntity } from '../../store/selectors';
import asDroppable from './asDroppable';

import './tasks.scss';


export interface Props {
  tasks: Array<TaskUIEntity>;
  sectionId?: string;
  isDraggingOver?: boolean;
}

const TasksList = ({ tasks, isDraggingOver }: Props) => {
  const cls = cs('task-list', {
    ['task-list--dragging-over']: isDraggingOver,
  });

  return (
    <div className={cls}>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
        />
      ))}
    </div>
  );
};

export default asDroppable(TasksList);