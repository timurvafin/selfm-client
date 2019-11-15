import { useContext, useEffect, useMemo, useRef } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Event } from './constants';
import DNDContext from './Context';
import { DroppableContext } from './Droppable';
import { DraggableItem, DraggableProps } from './types';


const Draggable = ({
  id,
  type,
  payload,
  canDrag,
  children,
  useHandle,
  previewComponent,
}: DraggableProps) => {
  const ref = useRef<HTMLDivElement>();
  const droppableContext = useContext(DroppableContext);
  const dndContext = useContext(DNDContext);

  const size = useMemo(() => {
    const nodeRect = ref.current ? ref.current.getBoundingClientRect() : {};
    // @ts-ignore
    return nodeRect ? { width: nodeRect.width, height: nodeRect.height } : { width: 0, height: 0 };
  }, [ref.current]);

  const item: DraggableItem = useMemo(() => ({
    type,
    id,
    size,
    parent: droppableContext.item,
    payload,
  }), [id, type, payload, size, droppableContext.item]);

  const [collectedProps, connectDrag, connectPreview] = useDrag({
    begin: () => {
      dndContext.eventRouter.fire(Event.BEGIN_DRAG, item);
    },
    end: () => {
      dndContext.eventRouter.fire(Event.END_DRAG, item);
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
      if (previewComponent) {
        // Регистрируем компонент для отрисовки превью.
        dndContext.dragPreviewComponents.set(id, previewComponent);
        // Скрываем коробочное превью react-dnd.
        connectPreview(getEmptyImage(), { captureDraggingState: false });
      }
    },
    []
  );

  return children({
    item,
    setRef: (node) => {
      ref.current = node;

      if (useHandle) {
        connectPreview(node);
      } else {
        connectDrag(node);
      }
    },
    setHandleRef: (node) => {
      connectDrag(node);
    },
    style: collectedProps.isDragging ? { opacity: 0 } : {},
    ...collectedProps,
  });
};

export default Draggable;