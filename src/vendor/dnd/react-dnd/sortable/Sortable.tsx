import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Event } from '../constants';
import DNDContext from '../Context';
import Droppable from '../Droppable';
import { DraggableItem, DroppableContentProps } from '../types';
import { accepts, findDropPosition, getEmptyPlaceholderStyle, getItemStyle, getPlaceholderStyle } from './helpers';
import { ISortableContext, SortableProps } from './index';
import useStore from './useStore';


export const SortableContext = React.createContext(null);

const Sortable = ({ children, id, type, onMove, accept }: SortableProps) => {
  const ref = useRef<HTMLDivElement>();
  const dndContext = useContext(DNDContext);
  const store = useStore();
  const [dragSource, setDragSource] = useState<DraggableItem>(null);

  useEffect(
    () => {
      const onBeginDrag = (draggable) => {
        if (accepts(accept, draggable)) {
          setDragSource(draggable);
          store.init(ref.current.getBoundingClientRect());
        }
      };

      const onEndDrag = (draggable) => {
        if (accepts(accept, draggable)) {
          setDragSource(null);
          store.reset();
        }
      };

      const unsubsribeBeginHandler = dndContext.eventRouter.addHandler(Event.BEGIN_DRAG, onBeginDrag);
      const unsubsribeEndHandler = dndContext.eventRouter.addHandler(Event.END_DRAG, onEndDrag);

      return () => {
        unsubsribeBeginHandler();
        unsubsribeEndHandler();
      };
    },
    [dndContext.eventRouter]
  );

  const context = useMemo<ISortableContext>(() => ({
    registerNode: (id, rect) => {
      store.registerNode(id, rect);
      return () => store.unregisterNode(id);
    },
    getItemStyle: (id, index) => getItemStyle(store.getItemPosition(id) - index, dragSource),
  }), [store, dragSource]);

  const lastTimeRef = useRef(0);
  const onHover = (item: any, mouseOffset) => {
    const sortableItem = store.getItem(item.id);
    const position = findDropPosition(store.getItems(), mouseOffset.y, item.id);

    // Если элемента нет в сторе, значит этот элемент перемещен из чужого списка. Добавлем его.
    if (!sortableItem) {
      return store.addItem(item.id, position, item.nodeRect);
    }

    const sortablePosition = store.getItemPosition(item.id);
    // Ничего не делаем если позиция не изменилась
    if (position === sortablePosition) {
      return;
    }

    // Во избежания слишком частых вызовов ставим лимит
    if (Date.now() - lastTimeRef.current < 100) {
      return;
    }

    lastTimeRef.current = Date.now();
    store.moveItem(item.id, position);
  };

  const onDrop = (draggableItem) => {
    onMove(draggableItem, store.getItemPosition(draggableItem.id));
    // Сохраняем состояние сортировки в основной массив
    store.commit();
  };

  const onLeave = (draggableItem) => {
    // Если элемент покидает список, то удаляем его данные о положении.
    store.removeItem(draggableItem.id);
  };

  return (
    <Droppable
      id={id}
      type={type}
      accept={accept}
      onHover={onHover}
      onDrop={onDrop}
      onLeave={onLeave}
    >
      {({ setRef: setDroppableRef, isOver, draggableItem }: DroppableContentProps) => {
        const sortableItem = draggableItem ? store.getItem(draggableItem.id) : null;
        const isForeign = draggableItem && draggableItem.parent.id !== id;

        const dropPlaceholder = isOver && sortableItem && (
          // @ts-ignore
          <div style={getPlaceholderStyle(sortableItem, store.getItemOffset(sortableItem.id))} />
        );

        const emptyPlaceholder = isOver && sortableItem && isForeign && (
          // @ts-ignore
          <div style={getEmptyPlaceholderStyle(sortableItem)} />
        );

        return (
          <SortableContext.Provider value={context}>
            {
              children({
                setRef: node => {
                  setDroppableRef(node);
                  ref.current = node;
                },
                isOver,
                draggableItem,
                placeholder: emptyPlaceholder,
              })
            }
            { dropPlaceholder }
          </SortableContext.Provider>
        );
      }}
    </Droppable>
  );
};

export default Sortable;