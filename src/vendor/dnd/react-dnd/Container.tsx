import React, { useMemo, useRef, useState } from 'react';
import DragLayer from './DragLayer';
import DNDContext from './Context';
import { DraggableRenderer } from './types';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


export const Container = ({ children }) => {
  const [dropTarget, setDropTarget] = useState(null);
  const [draggableItem, setDraggableItem] = useState(null);
  const draggableComponentsRegistry = useRef(new Map<string, DraggableRenderer>());

  const context = useMemo(() => ({
    dropTarget,
    setDropTarget,
    draggableItem,
    setDraggableItem,
    draggableComponentsRegistry: draggableComponentsRegistry.current,
  }), [dropTarget]);

  return (
    <DndProvider backend={HTML5Backend}>
      <DNDContext.Provider value={context}>
        { draggableComponentsRegistry.current.size > 0 && <DragLayer /> }
        { children }
      </DNDContext.Provider>
    </DndProvider>
  );
};