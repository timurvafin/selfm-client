import { useContext, useEffect, useMemo, useRef } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import DNDContext from './Context';
import { DroppableContext } from './Droppable';
import { DraggableItem, DraggableProps } from './types';


const Draggable = ({
  id,
  type,
  canDrag,
  children,
}: DraggableProps) => {
  const ref = useRef<HTMLDivElement>();
  const droppableContext = useContext(DroppableContext);
  const dndContext = useContext(DNDContext);
  const nodeRect = ref.current ? ref.current.getBoundingClientRect() : null;

  const item: DraggableItem = useMemo(() => ({
    type,
    id,
    nodeRect,
    parentDroppable: droppableContext.item,
  }), [id, type, nodeRect, droppableContext.item]);

  const [collectedProps, connectDrag, connectPreview] = useDrag({
    begin: () => {
      dndContext.setDraggableItem(item);
    },
    end: () => {
      dndContext.setDraggableItem(null);
    },
    item: item,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
      startComponentPosition: monitor.getInitialSourceClientOffset(),
      startMousePosition: monitor.getInitialClientOffset(),
    }),
    canDrag,
  });

  useEffect(
    () => {
      dndContext.draggableComponentsRegistry.set(id, children);
      connectPreview(getEmptyImage(), { captureDraggingState: false });
    },
    []
  );

  return children({
    setRef: (node) => {
      ref.current = node;
      connectDrag(node);
    },
    componentRect: nodeRect,
    style: collectedProps.isDragging ? { opacity: 0 } : {},
    dropTarget: dndContext.dropTarget,
    ...collectedProps,
    isDragging: false,
  });
};

export default Draggable;