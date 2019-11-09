import { ReactElement } from 'react';


export type XYCoords = {
  x: number;
  y: number;
}

export type DraggableItem = {
  id: string;
  type: string;
  parentDroppable: DroppableItem;
};

export type DroppableItem = {
  id: string;
  type: string;
};

export type SetNode = (node: HTMLDivElement) => void;

export interface DraggableContentProps {
  setRef: SetNode;
  style?: object;
  dropTarget: DroppableItem;
  isDragging: boolean;
  canDrag: boolean;
  componentRect: ClientRect;
  startComponentPosition: XYCoords;
  startMousePosition: XYCoords;
}

export type DraggableRenderer = (props: DraggableContentProps) => ReactElement

export interface DraggableProps {
  id: string;
  type: string;
  children: DraggableRenderer;
  canDrag?: boolean | (() => boolean);
}

export type DroppableEventHandler = (draggable: DraggableItem) => void;

export interface DroppableContentProps {
  setRef: SetNode;
  isOver: boolean;
  draggableItem: DraggableItem;
}

export type DroppableRenderer = (props: DroppableContentProps) => ReactElement

export type DroppableHoverHandler = (draggable: DraggableItem, mouseOffset: XYCoords) => void;

export interface DroppableProps {
  id: string;
  type: string;
  accept: string | [string];
  canDrop?: (draggable: DraggableItem) => boolean;
  onHover?: DroppableHoverHandler;
  onEnter?: DroppableEventHandler;
  onLeave?: DroppableEventHandler;
  onDrop?: DroppableEventHandler;
  // canDrop?: () => boolean;
  children: DroppableRenderer;
}

