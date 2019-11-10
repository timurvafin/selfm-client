import { Reducer, useMemo, useReducer } from 'react';
import { XYCoords } from '../types';
import { arrayMove } from './helpers';


export type NodeItem = {
  id: string;
  rect: ClientRect;
};

export type SortableNode = {
  id: string;
  rect: ClientRect;
  offset: XYCoords;
}

export type State = {
  parentRect: ClientRect;
  // Данные о размерах
  nodes: Array<NodeItem>;
  // Данные о расположении элементов
  sortableItems: Array<SortableNode>;
};

export const initialState = {
  parentRect: null,
  nodes: [],
  sortableItems: [],
};

export const getItem = (state, id) => state.sortableItems.find(info => info.id === id);

export const getItemPosition = (state, id) => {
  return state.sortableItems.findIndex(info => info.id === id);
};

export const getItemOffset = (state, id) => {
  const item = state.sortableItems.find(info => info.id === id);

  return item ? item.offset : null;
};

const makeSortableItems = (nodes: Array<NodeItem>, parentRect: ClientRect) => {
  let prevOffset = null;
  let prevItem = null;
  const parentOffset = { x: parentRect.left, y: parentRect.top };

  return nodes.map((item) => {
    let offset;

    if (!prevOffset) {
      offset = parentOffset;
    } else {
      offset = { x: prevOffset.x, y: prevOffset.y + prevItem.rect.height };
    }

    prevItem = item;
    prevOffset = offset;

    return {
      ...item,
      offset,
    };
  });
};

export const reducer = (state: State, action) => {
  switch (action.type) {
    case 'registerNode': {
      const { id, rect } = action;
      const nodes = [...state.nodes, {
        id,
        rect,
      }];

      return {
        ...state,
        nodes,
      };
    }
    case 'unregisterNode': {
      const nodes = state.nodes.filter(item => item.id !== action.id);

      return {
        ...state,
        nodes,
      };
    }
    case 'addItem': {
      const { id, rect, position } = action;
      const sortableItemsCopy = [...state.sortableItems];
      sortableItemsCopy.splice(position, 0, {
        id,
        rect,
        offset: null,
      });

      return { ...state, sortableItems: makeSortableItems(sortableItemsCopy, state.parentRect) };
    }
    case 'removeItem': {
      const sortableItems = state.sortableItems.filter(item => item.id !== action.id);

      return {
        ...state,
        sortableItems,
      };
    }
    case 'moveItem': {
      const { id, position } = action;
      const sourcePosition = getItemPosition(state, id);
      const sortableItems = arrayMove(state.sortableItems, sourcePosition, position);

      return { ...state, sortableItems: makeSortableItems(sortableItems, state.parentRect) };
    }
    case 'init': {
      return {
        ...state,
        parentRect: action.parentRect,
        sortableItems: makeSortableItems(state.nodes, action.parentRect),
      };
    }
    case 'commit': {
      return {
        ...state,
        nodes: state.sortableItems.map(({ id, rect }) => ({ id, rect })) };
    }
    case 'reset': {
      return {
        ...state,
        sortableItems: makeSortableItems(state.nodes, state.parentRect),
      };
    }
    default:
      throw new Error();
  }
};

export default function useStore() {
  const [state, dispatch] = useReducer<Reducer<State, any>>(reducer, initialState);

  const actions = useMemo(() => ({
    registerNode: (id, rect) => dispatch({ type: 'registerNode', id, rect }),
    unregisterNode: (id) => dispatch({ type: 'unregisterNode', id }),
    addItem: (id, position, rect) => dispatch({ type: 'addItem', id, rect, position }),
    removeItem: (id) => dispatch({ type: 'removeItem', id }),
    moveItem: (id, position) => dispatch({ type: 'moveItem', id, position }),
    init: (parentRect: ClientRect) => dispatch({ type: 'init', parentRect }),
    commit: () => dispatch({ type: 'commit' }),
    reset: () => dispatch({ type: 'reset' }),
    getItem: id => getItem(state, id),
    getItems: () => state.sortableItems,
    getItemOffset: id => getItemOffset(state, id),
    getItemPosition: id => getItemPosition(state, id),
  }), [state]);

  return actions;
}