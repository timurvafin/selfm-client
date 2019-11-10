import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { Event } from './constants';
import DNDContext from './Context';
import { DroppableContextShape, DroppableProps } from './types';


export const DroppableContext = React.createContext<DroppableContextShape>({ item: null });

const Droppable = ({
  id,
  type,
  accept,
  canDrop,
  onHover,
  onDrop,
  onEnter,
  onLeave,
  children,
}: DroppableProps) => {
  const droppableContext = useMemo(() => ({
    item: { id, type },
  }), [id, type]);

  const dndContext = useContext(DNDContext);
  const [{ isOver, draggableItem, didDrop }, drop] = useDrop({
    accept: accept,
    hover: onHover ? (item, monitor) => onHover(item, monitor.getClientOffset()) : null,
    drop: onDrop,
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      draggableItem: monitor.getItem(),
      didDrop: monitor.didDrop(),
    }),
    canDrop,
  });

  const [prevIsOver, setPrevIsOver] = useState(false);
  useEffect(
    () => {
      if (prevIsOver && !isOver && !didDrop && draggableItem) {
        onLeave && onLeave(draggableItem);
        dndContext.eventRouter.fire(Event.DRAG_LEAVE);
      }

      if (!prevIsOver && isOver && !didDrop && draggableItem) {
        // setTimeout для того, чтобы dndContext.setDropTarget(null) не перезатирал значение
        setTimeout(() => dndContext.eventRouter.fire(Event.DRAG_LEAVE, { id, type }));
        onEnter && onEnter(draggableItem);
      }

      setPrevIsOver(isOver);
    },
    [isOver, draggableItem]
  );

  return (
    <DroppableContext.Provider value={droppableContext}>
      {
        children({
          setRef: drop,
          isOver,
          draggableItem,
        })
      }
    </DroppableContext.Provider>
  );
};

export default Droppable;
