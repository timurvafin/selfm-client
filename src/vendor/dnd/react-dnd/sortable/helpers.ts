import { DraggableItem, XYCoords } from '../types';
import { SortableNode } from './useStore';


export const arrayMove = (arr: Array<any>, fromIndex, toIndex) => {
  const copy = [...arr];
  if (toIndex >= copy.length) {
    let k = toIndex - copy.length + 1;
    while (k--) {
      copy.push(undefined);
    }
  }

  copy.splice(toIndex, 0, copy.splice(fromIndex, 1)[0]);
  return copy;
};

export const getItemStyle = (orderDelta, draggableItem) => {
  if (!draggableItem) {
    return {};
  }

  return {
    transition: 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    transform: `translateY(${orderDelta * draggableItem.nodeRect.height}px)`,
  };
};

export const getEmptyPlaceholderStyle = (draggable: SortableNode) => {
  if (!draggable) {
    return {};
  }

  return {
    width: draggable.rect.width,
    height: draggable.rect.height,
    pointerEvents: 'none',
    visibility: 'hidden',
  };
};

export const getPlaceholderStyle = (sortableItem: SortableNode, offset?: XYCoords) => {
  if (!sortableItem) {
    return {};
  }

  return {
    width: sortableItem.rect.width,
    height: sortableItem.rect.height,
    pointerEvents: 'none',
    position: 'fixed',
    left: offset ? offset.x : null,
    top: offset ? offset.y : null,
    backgroundColor: 'rgb(237, 247, 255)',
    border: '1px dashed #0081e8',
    borderRadius: 3,
  };
};

// Вычисляет позицию, куда нужно поместить элемент на основе заданного положения мыши.
export const findDropPosition = (sortableItems: Array<SortableNode>, mouseY, draggableId) => {
  if (sortableItems.length <= 0) {
    return 0;
  }

  let position = 0;
  for (const item of sortableItems) {
    if (item.id === draggableId) {
      continue;
    }

    const middleY = item.offset.y + item.rect.height / 2;
    if (mouseY > middleY) {
      position++;
    } else {
      return position;
    }
  }

  return Math.min(position, sortableItems.length);
};

export const accepts = (accept, draggable: DraggableItem) => {
  if (Array.isArray(accept)) {
    return accept.includes(draggable.type);
  }

  return accept === draggable.type;
};