import React, { useCallback } from 'react';
import { UIComponentType } from 'common/constants';
import { DNDDestinationItem, DNDSourceItem, Droppable } from 'vendor/dnd';
import { DropHandler } from 'vendor/dnd/types';
import TasksList, { Props } from './TaskList';


const DroppableTaskList = ({ onTaskDrop, id, ...props }: Props & { id: string; onTaskDrop: DropHandler }) => {
  const onDrop = useCallback((sourceItem: DNDSourceItem, destinationItem: DNDDestinationItem) => {
    if (sourceItem.type === UIComponentType.TASK) {
      onTaskDrop(sourceItem, destinationItem);
    }
  }, [onTaskDrop]);

  return (
    <Droppable
      id={id}
      className={'task-list-container'}
      accept={UIComponentType.TASK}
      onDrop={onDrop}
    >
      <TasksList
        droppable
        {...props}
      />
    </Droppable>
  );
};

export default DroppableTaskList;