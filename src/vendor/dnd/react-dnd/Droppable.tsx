import { useContext, useEffect, useState } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import DNDContext from './Context';
import { DroppableProps } from './types';


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
  const dndContext = useContext(DNDContext);
  const [{ isOver, draggableItem }, drop] = useDrop({
    accept: accept,
    hover: onHover ? (item, monitor) => onHover(item, monitor.getClientOffset()) : null,
    drop: onDrop,
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      draggableItem: monitor.getItem(),
    }),
    canDrop,
  });

  const [prevIsOver, setPrevIsOver] = useState(false);
  useEffect(
    () => {
      if (prevIsOver && !isOver) {
        onLeave && onLeave(draggableItem);
      }

      if (!prevIsOver && isOver) {
        onEnter && onEnter(draggableItem);
      }

      setPrevIsOver(isOver);
    },
    [isOver, draggableItem]
  );

  useEffect(
    () => {
      if (isOver) {
        setTimeout(() => dndContext.setDropTarget({ id, type }));
      } else {
        dndContext.setDropTarget(null);
      }
    },
    [isOver]
  );

  return children({
    setRef: drop,
    isOver,
    draggableItem,
  });
};

export default Droppable;
