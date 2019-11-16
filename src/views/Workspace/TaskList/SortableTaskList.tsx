import React, { useCallback } from 'react';
import { UIComponentType } from 'common/constants';
import { DropResult, Sortable, SortableContentProps } from 'vendor/dnd/react-dnd/sortable';
import { ID } from 'common/types';
import TasksList, { Props } from './TaskList';

import * as styles from './tasks.scss';


type TaskDropHandler = (id: ID, dropResult: DropResult) => void;

const SortableTaskList = ({ onTaskDrop, id, ...props }: Props & { id: string; onTaskDrop: TaskDropHandler }) => {
  const onItemDrop = useCallback((dropResult: DropResult) => {
    if (dropResult.item.type === UIComponentType.TASK) {
      onTaskDrop(dropResult.item.id, dropResult);
    }
  }, [onTaskDrop]);

  return (
    <Sortable
      id={id}
      type={UIComponentType.TASK_LIST}
      accept={UIComponentType.TASK}
      onItemDrop={onItemDrop}
    >
      {({ setRef, placeholder }: SortableContentProps) => (
        <div
          ref={setRef}
          className={styles.container}
        >
          <TasksList
            droppable
            {...props}
          >
            {placeholder}
          </TasksList>
        </div>
      )}
    </Sortable>
  );
};

export default SortableTaskList;