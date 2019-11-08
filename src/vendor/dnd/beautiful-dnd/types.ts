import { ReactElement } from 'react';
import { UIComponentType } from 'common/constants';


export type DNDId = { id: any; type: UIComponentType };
export type DNDSourceItem = { id: string; type: UIComponentType; droppableId: string; index: number };
export type DNDDestinationItem = { droppableId: string; index: number };

export interface DraggableProps {
  id: string;
  index: number;
  type: UIComponentType;
  isDisabled?: boolean;
  className?: string;
  children: ReactElement;
}

export type DropHandler = (sourceItem: DNDSourceItem, destinationItem: DNDDestinationItem) => void;

export interface DroppableProps {
  id: string;
  accept?: UIComponentType;
  isCombineEnabled?: boolean;
  mode?: 'reorder' | 'copy';
  isDisabled?: boolean;
  className?: string;
  children: ReactElement;
  onDrop: DropHandler;
}

export interface DraggableComponentProps {
  isDragging?: boolean;
  canCombined?: boolean;
}

export interface DroppableComponentProps {
  isDraggingOver?: boolean;
}