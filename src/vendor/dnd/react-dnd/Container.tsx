import React, { useMemo, useRef } from 'react';
import DragLayer from './DragLayer';
import DNDContext from './Context';
import EventRouter from './EventRouter';
import { DraggableRenderer, IDNDContext } from './types';
import { DndProvider } from 'react-dnd';


/**
 * Содержит:
 *  - EventRouter, через который могут общаться между собой отедльные компоненты (Sortable, Droppable, DragLayer и тп)
 *  - draggableComponents - хранилище компонентов, которые рендерят Draggable контент. Нужен для отрисовки drag preview в DragLayer'e.
 */
export const Container = ({ children, backend }) => {
  const draggableComponents = useRef(new Map<string, DraggableRenderer>());
  const eventRouter = useRef(new EventRouter());

  const context: IDNDContext = useMemo(() => ({
    eventRouter: eventRouter.current,
    draggableComponents: draggableComponents.current,
  }), [draggableComponents.current.size]);

  return (
    <DndProvider backend={backend}>
      <DNDContext.Provider value={context}>
        <DragLayer />
        { children }
      </DNDContext.Provider>
    </DndProvider>
  );
};