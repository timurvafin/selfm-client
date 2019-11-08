import { ReactElement, ReactNode } from 'react';
import {
  DraggableItem,
  DraggableContentProps,
  DroppableContentProps,
  DroppableProps,
  DraggableProps,
} from '../types';
import Sortable from "./Sortable";
import SortableElement from "./SortableElement";


export interface SortableContentProps extends DroppableContentProps {
  placeholder?: ReactNode;
}

export type SortableItem = DraggableItem & { index: number };

export type MoveHandler = (draggableSource: DraggableItem, targetPosition: number) => void;

export type SortableRenderer = (props: SortableContentProps) => ReactElement;

export interface SortableProps extends Omit<DroppableProps, 'onHover'> {
  children: SortableRenderer;
  onMove: MoveHandler;
}

export interface SortableItemContentProps extends DraggableContentProps {
}

export type SortableItemRenderer = (props: SortableItemContentProps) => ReactElement;

export interface SortableItemProps extends DraggableProps {
  children: SortableItemRenderer;
  index: number;
}

export {
  Sortable,
  SortableElement,
}