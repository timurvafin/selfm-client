import React from 'react';
import cs from 'classnames';
import Task from './Task';
import { TaskUIEntity } from '../../store/selectors';
import asDroppable from './asDroppable';

import './tasks.scss';


export interface Props {
  tasks: Array<TaskUIEntity>;
}

const TasksList = ({ tasks }: Props) => {
  const taskDataList = tasks.map((task, index) => (
    <Task
      key={task.id}
      task={task}
      index={index}
    />
  ));

  const cls = cs('task-list', {
    ['task-list--dragging']: false,
  });

  return (
    <div className={cls}>
      {taskDataList}
    </div>
  );
};

export default asDroppable(TasksList);