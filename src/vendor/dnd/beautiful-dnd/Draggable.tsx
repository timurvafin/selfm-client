import React from 'react';
import { Draggable as DraggableImpl, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { encodeDraggableId } from './utils';
import { DraggableProps } from './types';


const Draggable = ({ index, id, type, isDisabled, className, children }: DraggableProps) => (
  <DraggableImpl
    index={index}
    // type={'TASK'}
    draggableId={encodeDraggableId(id, type)}
    isDragDisabled={isDisabled}
    type={type}
  >
    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <div
        ref={provided.innerRef}
        className={className}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {
          React.cloneElement(children, {
            canCombined: !!snapshot.combineTargetFor,
            isDragging: snapshot.isDragging,
          })
        }
      </div>
    )}
  </DraggableImpl>
);

export default Draggable;