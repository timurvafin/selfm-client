import React, { useCallback, useContext, useMemo, useRef } from 'react';
import DNDContext from '../Context';
import Droppable from '../Droppable';
import { DraggableItem, DroppableContentProps } from '../types';
import { getEmptyPlaceholderStyle, getPlaceholderStyle, getSortableItemStyle } from './helpers';
import { SortableProps } from './index';
import useChildren from './useChildren';


export const SortableContext = React.createContext(null);

const DroppableContent = ({
  droppableId,
  setRef,
  setChildNode,
  isOver,
  getOrder,
  draggableItem,
  getChild,
  getOffset,
  children,
}) => {
  const getItemStyle = useCallback((id, index) => {
    return getSortableItemStyle(getOrder(id) - index, draggableItem);
  }, [getOrder, draggableItem]);

  const context = useMemo(() => ({
    setChildNode,
    getItemStyle,
  }), [setChildNode, getItemStyle]);

  const draggableInfo = draggableItem ? getChild(draggableItem.id) : null;
  const isForeign = draggableItem && draggableItem.parentDroppable.id !== droppableId;

  const dropPlaceholder = isOver && draggableInfo && (
    // @ts-ignore
    <div style={getPlaceholderStyle(draggableInfo, getOffset(getOrder(draggableInfo.id)))} />
  );

  const emptyPlaceholder = isOver && draggableInfo && isForeign && (
    // @ts-ignore
    <div style={getEmptyPlaceholderStyle(draggableInfo)} />
  );

  return (
    <SortableContext.Provider value={context}>
      {
        children({
          setRef,
          isOver,
          draggableItem,
          placeholder: emptyPlaceholder,
        })
      }
      { dropPlaceholder }
    </SortableContext.Provider>
  );
};

const Sortable = ({ children, id, type, onMove, accept }: SortableProps) => {
  const ref = useRef<HTMLDivElement>();
  const dndContext = useContext(DNDContext);
  const draggableItem: DraggableItem = dndContext.draggableItem;

  const {
    setChildNode,
    addChild,
    removeChild,
    moveChild,
    getChild,
    getOrder,
    getOffset,
    findDropPosition,
  } = useChildren(ref.current, draggableItem);

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
          droppableId={id}
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