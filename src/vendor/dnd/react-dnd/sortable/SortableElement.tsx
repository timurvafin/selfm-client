import React, { useContext, useEffect, useRef } from 'react';
import Draggable from '../Draggable';
import { ISortableContext, SortableItemProps } from './index';
import { SortableContext } from './Sortable';


const SortableElement = ({ id, type, canDrag, children }: SortableItemProps) => {
  const ref = useRef<HTMLDivElement>();
  const sortableContext = useContext<ISortableContext>(SortableContext);
  const style = sortableContext.getItemStyle(id);

  useEffect(
    () => {
      // Регистрируем элемент для фиксации размеров.
      const unregister = sortableContext.registerNode(id, ref.current.getBoundingClientRect());
      return unregister;
    },
    []
  );

  return (
    <Draggable
      id={id}
      type={type}
      canDrag={canDrag}
    >
      {({ setRef: setDraggableRef, style: draggableStyle, ...draggableContentProps }) => children({
        setRef: (node) => {
          setDraggableRef(node);
          ref.current = node;
        },
        style: { ...draggableStyle, ...style },
        ...draggableContentProps,
      })}
    </Draggable>
  );
};

export default SortableElement;