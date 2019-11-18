import React, { ReactNode } from 'react';
import cs from 'classnames';
import { TaskUIEntity } from 'store/selectors';
import Task, { SortableTask } from '../Task';
import InlineTaskCreationField from './InlineTaskCreationField';
import styles from './tasks.scss';


export interface Props {
  tasks: Array<TaskUIEntity>;
  onTaskCreate?: (caption: string) => void;
  orderBy?: string;
  droppable?: boolean;
  children?: ReactNode;
  getBottomLabel?: (task: TaskUIEntity) => ReactNode;
}

const TasksList = ({ tasks, orderBy, droppable, onTaskCreate, children, getBottomLabel }: Props) => {
  const cls = cs(styles.list, {
  });

  if (orderBy) {
    tasks = tasks.sort((a, b) => a[orderBy] - b[orderBy]);
  }

  const TaskComponent = droppable ? SortableTask : Task;

  return (
    <div className={cls}>
      {tasks.map((task) => (
        <TaskComponent
          key={task.id}
          task={task}
          getBottomLabel={getBottomLabel}
        />
      ))}
      { children }
      { onTaskCreate && <InlineTaskCreationField onCreate={onTaskCreate} /> }
    </div>
  );
};

export default TasksList;