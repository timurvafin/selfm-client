import React from 'react';
import cs from 'classnames';
import Task from './Task';
import { projectTasksSelector, TaskUIModel } from '../../store/selectors';
import { useSelector } from 'react-redux';
import { State } from '../../store';
import asDroppable from './asDroppable';

import './tasks.scss';
import { ID } from '../../common/types';


export interface Props {
  projectId: ID;
  sectionId?: ID;
}

const TasksList = ({ projectId, sectionId }: Props) => {
  const tasks = useSelector<State, Array<TaskUIModel>>(state => projectTasksSelector(state, projectId, sectionId));

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