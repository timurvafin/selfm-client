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