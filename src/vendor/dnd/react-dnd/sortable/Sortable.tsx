import React, { useContext, useMemo, useRef } from 'react';
import DNDContext from '../Context';
import Droppable from '../Droppable';
import { DroppableContentProps, XYCoords } from '../types';
import { SortableProps } from './index';
import useChildren from './useChildren';


const getItemStyle = (orderDelta, draggableItem) => {
  if (!draggableItem) {
    return {};
  }

  return {
    transition: 'transform 200ms ease-in-out',
    transform: `translateY(${orderDelta * draggableItem.nodeRect.height}px)`,
  };
};

const getPlaceholderStyle = (draggableInfo, offset?: XYCoords) => {
  if (!draggableInfo) {
    return {};
  }

  return {
    width: draggableInfo.width,
    height: draggableInfo.height,
    pointerEvents: 'none',
    position: 'fixed',
    left: offset ? offset.x : null,
    top: offset ? offset.y : null,
    backgroundColor: '#f7f7f7',
  };
};

const DropPlaceholder = ({ style }) => {
  return (
    <div
      className="drop-placeholder"
      style={style}
    />
  );
};

export const SortableContext = React.createContext(null);

const DroppableContent = ({
  setRef,
  setChildNode,
  isOver,
  getOrder,
  draggableItem,
  getChild,
  getOffset,
  children,
}) => {
  const context = useMemo(() => ({
    setChildNode,
    getItemStyle: (id, index) => {
      return getItemStyle(getOrder(id) - index, draggableItem);
    },
  }), [isOver, getOrder]);

  const draggableInfo = draggableItem ? getChild(draggableItem.id) : null;

  const placeholder = isOver && draggableInfo && (
    <DropPlaceholder style={getPlaceholderStyle(draggableInfo, getOffset(getOrder(draggableInfo.id)))} />
  );

  return (
    <SortableContext.Provider value={context}>
      {
        children({
          setRef,
          isOver,
          placeholder,
          draggableItem,
        })
      }
    </SortableContext.Provider>
  );
};

const Sortable = ({ children, id, type, onMove, accept }: SortableProps) => {
  const ref = useRef<HTMLDivElement>();
  const dndContext = useContext(DNDContext);

  const {
    setChildNode,
    addChild,
    removeChild,
    moveChild,
    getChild,
    getOrder,
    getOffset,
    findDropPosition,
  } = useChildren(ref.current, dndContext.draggableItem);

  const lastTimeRef = useRef(0);
  const onHover = (item: any, mouseOffset) => {
    const draggableInfo = getChild(item.id);
    const position = findDropPosition(mouseOffset.y, draggableInfo && draggableInfo.id);

    if (!draggableInfo) {
      return addChild(item.id, position, { width: item.nodeRect.width, height: item.nodeRect.height });
    }

    /*if (isMouseOver(mouseOffset, draggableInfo)) {
      return;
    }*/

    if (position === draggableInfo.index) {
      return;
    }

    if (Date.now() - lastTimeRef.current < 100) {
      return;
    }

    lastTimeRef.current = Date.now();
    moveChild(draggableInfo.id, position);
  };

  const onDrop = (draggableItem) => {
    onMove(draggableItem, getOrder(draggableItem.id));
  };

  return (
    <Droppable
      id={id}
      type={type}
      accept={accept}
      onHover={onHover}
      onDrop={onDrop}
      onLeave={(draggableItem) => removeChild(draggableItem.id)}
    >
      {({ setRef, isOver, draggableItem }: DroppableContentProps) => (
        <DroppableContent
          isOver={isOver}
          draggableItem={draggableItem}
          getOrder={getOrder}
          getChild={getChild}
          getOffset={getOffset}
          setChildNode={setChildNode}
          setRef={node => {
            setRef(node);
            ref.current = node;
          }}
        >
          {children}
        </DroppableContent>
      )}
    </Droppable>
  );
};

export default Sortable;