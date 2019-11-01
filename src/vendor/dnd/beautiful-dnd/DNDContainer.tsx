import React, { useMemo, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import onDragEnd from './onDragEnd';


export const DNDContext = React.createContext(null);

const DNDContainer = ({ children }) => {
  const dropHandlersRegistry = useRef(new Map());
  const onDragEndHandler = useMemo(() => onDragEnd(dropHandlersRegistry.current), []);

  const contextValue = useRef({
    registerDropHandler: (droppableId, handler) => {
      dropHandlersRegistry.current.set(droppableId, handler);
    },
    unregisterDropHandler: (droppableId) => {
      dropHandlersRegistry.current.delete(droppableId);
    },
  });

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <DNDContext.Provider value={contextValue.current}>
        { children }
      </DNDContext.Provider>
    </DragDropContext>
  );
};

export default DNDContainer;