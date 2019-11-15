import React, { ReactElement } from 'react';
import EventRouter from './EventRouter';


export type ID = string;

export type XYCoords = {
  x: number;
  y: number;
}

export type Size = {
  width: number;
  height: number;
}

export type DraggableItem = {
  id: ID;
  type: string;
  parent: DroppableItem;
  size: Size;
  payload?: any;
};

export type DroppableItem = {
  id: ID;
  type: string;
};

export type SetRef = (node: HTMLDivElement) => void;

export interface DragPreviewProps {
  item: DraggableItem;
  currentComponentPosition: XYCoords;
  startComponentPosition: XYCoords;
  startMousePosition: XYCoords;
  dropTarget?: DroppableItem;
  componentSize: Size;
  wrapperStyle: object;
}

export interface DraggableContentProps {
  item: DraggableItem;
  setRef: SetRef;
  setHandleRef: SetRef;
  style?: object;
  isDragging: boolean;
  canDrag: boolean;
}

export type DraggableRenderer = (props: DraggableContentProps) => ReactElement

export interface DraggableProps {
  id: ID;
  type: string;
  payload?: any;
  children: DraggableRenderer;
  canDrag?: boolean | (() => boolean);
  useHandle?: boolean;
  previewComponent?: React.FC<DragPreviewProps>;
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
  onDrop?: DraggableEventHandler;
  onBeginDrag?: DraggableEventHandler;
  onEndDrag?: DraggableEventHandler;
  children: DroppableRenderer;
}

export interface DroppableContextShape {
  item: DroppableItem;
}

export interface IDNDContext {
  eventRouter: EventRouter;
  dragPreviewComponents: Map<string, React.FC<DragPreviewProps>>;
}
