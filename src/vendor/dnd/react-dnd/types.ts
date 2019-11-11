import { ReactElement } from 'react';
import EventRouter from './EventRouter';


export type ID = string;

export type XYCoords = {
  x: number;
  y: number;
}

export type DraggableItem = {
  id: ID;
  type: string;
  parent: DroppableItem;
};

export type DroppableItem = {
  id: ID;
  type: string;
};

export type SetRef = (node: HTMLDivElement) => void;

export interface DraggableContentProps {
  setRef: SetRef;
  style?: object;
  dropTarget?: DroppableItem;
  isDragging: boolean;
  canDrag: boolean;
  componentRect: ClientRect;
  startComponentPosition: XYCoords;
  startMousePosition: XYCoords;
}

export type DraggableRenderer = (props: DraggableContentProps) => ReactElement

export interface DraggableProps {
  id: ID;
  type: string;
  children: DraggableRenderer;
  canDrag?: boolean | (() => boolean);
}

export type DraggableEventHandler = (draggable: DraggableItem) => void;

export interface DroppableContentProps {
  setRef: SetRef;
  isOver: boolean;
  draggableItem: DraggableItem;
}

export type DroppableRenderer = (props: DroppableContentProps) => ReactElement

export type DroppableHoverHandler = (draggable: DraggableItem, mouseOffset: XYCoords) => void;

export interface DroppableProps {
  id: ID;
  type: string;
  accept: string | [string];
  canDrop?: (draggable: DraggableItem) => boolean;
  onHover?: DroppableHoverHandler;
  onEnter?: DraggableEventHandler;
  onLeave?: DraggableEventHandler;
  onBeginDrag?: DraggableEventHandler;
  onEndDrag?: DraggableEventHandler;
  onDrop?: DraggableEventHandler;
  // canDrop?: () => boolean;
  children: DroppableRenderer;
}

export interface DroppableContextShape {
  item: DroppableItem;
}

export interface IDNDContext {
  eventRouter: EventRouter;
  draggableComponents: Map<string, DraggableRenderer>;
}
