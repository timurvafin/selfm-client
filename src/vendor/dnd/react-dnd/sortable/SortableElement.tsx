import React, { useContext } from 'react';
import Draggable from '../Draggable';
import { SortableItemProps } from './index';
import { SortableContext } from './Sortable';


const SortableElement = ({ id, type, index, canDrag, children }: SortableItemProps) => {
  const sortableContext = useContext(SortableContext);
  const setNode = sortableContext.setChildNode;
  const style = sortableContext.getItemStyle(id, index);

  return (
    <Draggable
      id={id}
      type={type}
      canDrag={canDrag}
    >
      {({ setRef: setDraggableRef, style: draggableStyle, ...draggableContentProps }) => children({
        setRef: draggableContentProps.isDragging ? null : (node) => {
          setDraggableRef(node);
          setNode(id, node);
        },
        style: { ...draggableStyle, ...style },
        ...draggableContentProps,
      })}
    </Draggable>
  );
};

export default SortableElement;