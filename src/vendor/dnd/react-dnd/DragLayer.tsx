import React, { useContext } from 'react';
import { useDragLayer } from 'react-dnd';
import DNDContext from './Context';
import { DraggableContentProps } from './types';


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
  nodeRect: ClientRect,
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
    width: nodeRect.width,
    height: nodeRect.height,
    transform,
  };
}

const DragLayer = () => {
  const dndContext = useContext(DNDContext);
  const dropTarget = dndContext.dropTarget;

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

  if (!isDragging || !item) {
    return null;
  }

  function renderItem() {
    if (!item || !startMousePosition || !startComponentPosition) {
      return false;
    }

    const DraggableComponent = dndContext.draggableComponentsRegistry.get(item.id);

    if (!DraggableComponent) {
      return false;
    }

    const draggableProps: DraggableContentProps = {
      setRef: () => {},
      isDragging: true,
      canDrag: false,
      dropTarget,
      componentRect: item.nodeRect,
      startComponentPosition,
      startMousePosition,
    };

    return (
      <DraggableComponent {...draggableProps} />
    );
  }

  return (
    <div style={layerStyles}>
      <div style={getWrapperStyle(item.nodeRect, startComponentPosition, currentComponentPosition)}>
        {renderItem()}
      </div>
    </div>
  );
};

export default DragLayer;