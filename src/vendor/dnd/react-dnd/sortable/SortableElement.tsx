/* eslint-disable react/no-children-prop */
import React, { useContext, useEffect } from 'react';
import Draggable from '../Draggable';
import { DraggableContentProps } from '../types';
import { ISortableContext, SortableItemProps } from './index';
import { SortableContext } from './Sortable';


const DraggableContent = ({ children, ...props }: DraggableContentProps & { children: any }) => {
  const sortableContext = useContext<ISortableContext>(SortableContext);
  const style = sortableContext.getItemStyle(props.item.id);

  useEffect(
    () => {
      // Регистрируем элемент для фиксации размеров.
      const unregister = sortableContext.registerNode(props.item.id, props.item.size);
      return unregister;
    },
    [props.item.size]
  );

  return children({
    ...props,
    style: { ...props.style, ...style },
  });
};

const SortableElement = ({ children, ...draggableProps }: SortableItemProps) => {
  return (
    <Draggable {...draggableProps}>
      {(props) => (
        <DraggableContent
          {...props}
          children={children}
        />
      )}
    </Draggable>
  );
};

export default SortableElement;