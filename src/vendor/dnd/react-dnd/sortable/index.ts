import { ReactElement, ReactNode } from 'react';
import {
  DraggableItem,
  DraggableContentProps,
  DroppableContentProps,
  DroppableProps,
  DraggableProps,
  ID,
} from '../types';
import Sortable from "./Sortable";
import SortableElement from "./SortableElement";


export interface SortableContentProps extends DroppableContentProps {
  placeholder?: ReactNode;
}

export type SortableItem = DraggableItem & { index: number };

export type DropResult = {
  item: DraggableItem;
  position: number;
  isNew: boolean;
  newOrder: Array<ID>;
};

export type DropHandler = (dropResult: DropResult) => void;

export type SortableRenderer = (props: SortableContentProps) => ReactElement;

export interface SortableProps extends Omit<DroppableProps, 'onHover'> {
  children: SortableRenderer;
  onItemDrop: DropHandler;
}

export interface SortableItemContentProps extends DraggableContentProps {
}

export type SortableItemRenderer = (props: SortableItemContentProps) => ReactElement;

export interface SortableItemProps extends DraggableProps {
  children: SortableItemRenderer;
}

type UnregisterNode = () => void;

export interface ISortableContext {
  registerNode: (id: ID, rect: ClientRect) => UnregisterNode;
  getItemStyle: (id: ID) => object;
}

export {
  Sortable,
  SortableElement,
}