import React, { useContext, useEffect, useState } from 'react';
import { useDragLayer } from 'react-dnd';
import { Event } from './constants';
import DNDContext from './Context';
import { DragPreviewProps, Size } from './types';


const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getWrapperStyle(
  size: Size,
  startComponentPosition,
  currentComponentPosition,
) {
  if (!startComponentPosition || !currentComponentPosition) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentComponentPosition;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    width: size.width,
    height: size.height,
    transform,
  };
}

const DragLayer = () => {
  const dndContext = useContext(DNDContext);
  const [dropTarget, setDropTarget] = useState(null);

  useEffect(
    () => {
      const onDragEnter = (droppable) => setDropTarget(droppable);
      const onDragLeave = (droppable) => setDropTarget(droppable);

      const unsubscribeEnterHandler = dndContext.eventRouter.addHandler(Event.DRAG_ENTER, onDragEnter);
      const unsubscribeLeaveHandler = dndContext.eventRouter.addHandler(Event.DRAG_LEAVE, onDragLeave);

      return () => {
        unsubscribeEnterHandler();
        unsubscribeLeaveHandler();
      };
    },
    [dndContext.eventRouter],
  );

  const {
    isDragging,
    item,
    startComponentPosition,
    currentComponentPosition,
    startMousePosition,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    startComponentPosition: monitor.getInitialSourceClientOffset(),
    startMousePosition: monitor.getInitialClientOffset(),
    currentComponentPosition: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !item || !startMousePosition || !startComponentPosition) {
    return null;
  }

  const DragPreviewComponent = dndContext.dragPreviewComponents.get(item.id);

  if (!DragPreviewComponent) {
    return null;
  }

  const draggableProps: DragPreviewProps = {
    item,
    currentComponentPosition,
    dropTarget,
    startComponentPosition,
    startMousePosition,
    componentSize: item.size,
    wrapperStyle: getWrapperStyle(item.size, startComponentPosition, currentComponentPosition),
  };

  return (
    <div style={layerStyles}>
      <DragPreviewComponent {...draggableProps} />
    </div>
  );
};

export default DragLayer;