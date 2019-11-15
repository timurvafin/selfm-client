import React, { useMemo, useRef } from 'react';
import DragLayer from './DragLayer';
import DNDContext from './Context';
import EventRouter from './EventRouter';
import { DragPreviewProps, IDNDContext } from './types';
import { DndProvider } from 'react-dnd';


/**
 * Содержит:
 *  - EventRouter, через который могут общаться между собой отедльные компоненты (Sortable, Droppable, DragLayer и тп)
 *  - dragPreviewComponents - хранилище компонентов, которые рендерят Draggable контент. Нужен для отрисовки drag preview в DragLayer'e.
 */
export const Container = ({ children, backend }) => {
  const draggableComponents = useRef(new Map<string, React.FC<DragPreviewProps>>());
  const eventRouter = useRef(new EventRouter());

  const context: IDNDContext = useMemo(() => ({
    eventRouter: eventRouter.current,
    dragPreviewComponents: draggableComponents.current,
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