import React from 'react';
import { Draggable, DraggableStateSnapshot } from 'react-beautiful-dnd';
import TaskComp from './Task';
import { encodeDraggableId } from '../../common/utils/common';


const asDraggable = (Task: typeof TaskComp): typeof TaskComp => (props) => {
  const { task, index } = props;

  return (
    <Draggable
      index={index}
      type={'TASK'}
      draggableId={encodeDraggableId(task.id, 'task')}
      isDragDisabled={task.isOpen}
    >
      {(provided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          className={'task-outer'}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Task
            {...props}
            isDragging={snapshot.isDragging}
          />
        </div>
      )}
    </Draggable>
  );
};

export default asDraggable;