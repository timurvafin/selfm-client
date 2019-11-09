import { XYCoords } from '../types';


export type ChildInfo = {
  id: any;
  width: number;
  height: number;
  index: number;
  offset: XYCoords;
}

export const isMouseOver = (mouseOffset: XYCoords, child: ChildInfo) => {
  const isOverY = mouseOffset.y > child.offset.y && mouseOffset.y < child.offset.y + child.height;
  const isOverX = mouseOffset.x > child.offset.x && mouseOffset.x < child.offset.x + child.width;

  return isOverY && isOverX;
};

export const makeChildrenInfo = (childrenRefs) => {
  const notEmptyNodes = childrenRefs.filter((node) => !!node);

  let index = 0;
  return notEmptyNodes.map((node, id) => {
    if (!node) {
      return null;
    }

    const box: ClientRect = node.getBoundingClientRect();

    return {
      id,
      width: box.width,
      height: box.height,
      index: index++,
      offset: { y: box.top, x: box.left },
    };
  }).toList().toArray();
};

export const recalulateOffsets = (items, parentOffset) => {
  const newChildren = [];

  items.forEach((info, index) => {
    let offset;

    if (index === 0) {
      offset = parentOffset;
    } else {
      const prev = newChildren[index - 1];
      offset = { x: prev.offset.x, y: prev.offset.y + prev.height };
    }

    newChildren.push({
      ...info,
      index,
      offset,
    });
  });

  return newChildren;
};

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

export const getSortableItemStyle = (orderDelta, draggableItem) => {
  if (!draggableItem) {
    return {};
  }

  return {
    transition: 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    transform: `translateY(${orderDelta * draggableItem.nodeRect.height}px)`,
  };
};

export const getEmptyPlaceholderStyle = (draggableInfo) => {
  if (!draggableInfo) {
    return {};
  }

  return {
    width: draggableInfo.width,
    height: draggableInfo.height,
    pointerEvents: 'none',
    visibility: 'hidden',
  };
};

export const getPlaceholderStyle = (draggableInfo, offset?: XYCoords) => {
  if (!draggableInfo) {
    return {};
  }

  return {
    width: draggableInfo.width,
    height: draggableInfo.height,
    pointerEvents: 'none',
    position: 'fixed',
    left: offset ? offset.x : null,
    top: offset ? offset.y : null,
    backgroundColor: 'rgb(237, 247, 255)',
    border: '1px dashed #0081e8',
    borderRadius: 3,
  };
};