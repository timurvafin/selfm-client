import { useContext, useEffect, useMemo, useRef } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import DNDContext from './Context';
import { DraggableProps } from './types';


const Draggable = ({
  id,
  type,
  canDrag,
  children,
}: DraggableProps) => {
  const ref = useRef<HTMLDivElement>();
  const dndContext = useContext(DNDContext);
  const nodeRect = useMemo(() => ref.current ? ref.current.getBoundingClientRect() : null, [ref.current]);

  useEffect(
    () => {
      dndContext.draggableComponentsRegistry.set(id, children);
    },
    []
  );

  const item = { type, id, nodeRect };
  const [collectedProps, drag, previewRef] = useDrag({
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
      previewRef(getEmptyImage(), { captureDraggingState: false });
    },
    [],
  );

  return children({
    setRef: (node) => {
      ref.current = node;
      drag(node);
    },
    componentRect: nodeRect,
    style: collectedProps.isDragging ? { opacity: 0 } : {},
    dropTarget: dndContext.dropTarget,
    ...collectedProps,
    isDragging: false,
  });
};

export default Draggable;