import React, { useCallback } from 'react';
import { UIComponentType } from 'common/constants';
import { DraggableItem } from 'vendor/dnd/react-dnd';
import { MoveHandler, Sortable, SortableContentProps } from 'vendor/dnd/react-dnd/sortable';
import TasksList, { Props } from './TaskList';

import * as styles from './tasks.scss';


const SortableTaskList = ({ onTaskMove, id, ...props }: Props & { id: string; onTaskMove: MoveHandler }) => {
  const onMove = useCallback((sourceItem: DraggableItem, position: number) => {
    if (sourceItem.type === UIComponentType.TASK) {
      onTaskMove(sourceItem, position);
    }
  }, [onTaskMove]);

  return (
    <Sortable
      id={id}
      type={UIComponentType.TASK_LIST}
      accept={UIComponentType.TASK}
      onMove={onMove}
    >
      {({ setRef, placeholder }: SortableContentProps) => (
        <div
          ref={setRef}
          className={styles.container}
        >
          <TasksList
            droppable
            {...props}
          />
          {placeholder}
        </div>
      )}
    </Sortable>
  );
};

export default SortableTaskList;