import { useDrop, useDrag } from 'react-dnd';
import { useRef } from 'react';


const useDND = ({ id, index, isOpen }, { onMove, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);
  const taskSource = {
    item: { type: 'task', id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
    canDrag() {
      return !isOpen;
    },
  };

  const taskTarget = {
    accept: 'task',
    hover(item, monitor) {
      const dragIndex = monitor.getItem().index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    },
    drop() {
      onDrop();
    },
  };

  const [, drop] = useDrop(taskTarget);
  const [{ isDragging, canDrag }, drag, previewRef] = useDrag(taskSource);

  drag(drop(ref));

  return {
    dragRef: ref,
    previewRef,
    props: { isDragging, canDrag }
  };
};

export default useDND;
