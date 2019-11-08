import React, { useContext, useEffect } from 'react';
import { Droppable as DropppableImpl, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { DroppableProps } from './types';
import { DNDContext } from './DNDContainer';


const Droppable = ({
  id,
  accept,
  isDisabled,
  isCombineEnabled,
  className,
  mode,
  children,
  onDrop,
}: DroppableProps) => {
  const dndContext = useContext(DNDContext);
  useEffect(
    () => {
      dndContext.registerDropHandler(id, onDrop);
      return () => dndContext.unregisterDropHandler(id);
    },
    [onDrop]
  );

  return (
    <DropppableImpl
      droppableId={id}
      isCombineEnabled={isCombineEnabled}
      isDropDisabled={isDisabled}
      type={accept}
    >
      {(provided, snapshot: DroppableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          className={className}
          {...provided.droppableProps}
        >
          {
            React.cloneElement(children, {
              isDraggingOver: snapshot.isDraggingOver,
            })
          }
          {mode !== 'copy' && provided.placeholder}
        </div>
      )}
    </DropppableImpl>
  );
};

export default Droppable;