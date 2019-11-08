import { OrderedMap } from 'immutable';
import { useEffect, useRef, useState } from 'react';
import { arrayMove, ChildInfo, makeChildrenInfo, recalulateOffsets } from './helpers';


const useChildren = (parentNode, draggableItem) => {
  const [childrenInfo, setChildrenInfo] = useState<Array<ChildInfo>>([]);
  const childrenNodes = useRef(OrderedMap<any, any>());

  useEffect(
    () => {
      setChildrenInfo(makeChildrenInfo(childrenNodes.current));
    },
    [draggableItem]
  );

  const getParentOffset = () => {
    const parentRect = parentNode.getBoundingClientRect();
    return { x: parentRect.left, y: parentRect.top };
  };

  const setChildNode = (id, node) => {
    childrenNodes.current = childrenNodes.current.set(id, node);
  };

  const getChild = id => childrenInfo.find(info => info.id === id);

  const getOrder = id => {
    return childrenInfo.findIndex(info => info.id === id);
  };

  const getOffset = index => {
    if (index <= 0 || !childrenInfo[index]) {
      return getParentOffset();
    }

    return childrenInfo[index].offset;
  };

  const recalulateChildren = (children) => {
    const newChildren = recalulateOffsets(children, getParentOffset());
    setChildrenInfo(newChildren);
  };

  const addChild = (id, position, { width, height }) => {
    const copy = [...childrenInfo];
    copy.splice(position, 0, {
      id,
      width: width,
      height: height,
      index: position,
      offset: null,
    });

    recalulateChildren(copy);
  };

  const removeChild = (id) => {
    setTimeout(() => {
      const arr = childrenInfo.filter(info => info.id !== id);
      recalulateChildren(arr);
    }, 200);
  };

  const moveChild = (sourceId, targetPosition) => {
    const sourcePosition = getOrder(sourceId);
    const reordered = arrayMove(childrenInfo, sourcePosition, targetPosition);
    recalulateChildren(reordered);
  };

  const findDropPosition = (mouseY, draggableId) => {
    let position = 0;

    for (const info of childrenInfo) {
      if (info.id === draggableId) {
        continue;
      }

      const middleY = info.offset.y + info.height / 2;
      if (mouseY > middleY) {
        position++;
      } else {
        return position;
      }
    }

    return Math.min(position, childrenInfo.length - 1);
  };

  return {
    setChildNode,
    addChild,
    removeChild,
    moveChild,
    getOffset,
    getChild,
    getOrder,
    findDropPosition,
  };
};

export default useChildren;