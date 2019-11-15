import { Reducer, useMemo, useReducer } from 'react';
import { Size, XYCoords } from '../types';
import { arrayMove } from './helpers';


export type NodeItem = {
  id: string;
  size: Size;
};

export type SortableNode = {
  id: string;
  size: Size;
  offset: XYCoords;
}

export type State = {
  parentRect: ClientRect;
  // Данные о размерах
  nodes: Array<NodeItem>;
  // Данные о расположении элементов
  sortableItems: Array<SortableNode>;
};

const initialState = {
  parentRect: null,
  nodes: [],
  sortableItems: [],
};

const getItem = (state, id) => state.sortableItems.find(info => info.id === id);

const getItemPosition = (state, id) => {
  return state.sortableItems.findIndex(info => info.id === id);
};

const getInitialItemPosition = (state, id) => {
  return state.nodes.findIndex(info => info.id === id);
};

const getItemPositions = (state) => {
  return state.sortableItems.map(info => info.id);
};

const getItemOffset = (state, id) => {
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
      offset = { x: prevOffset.x, y: prevOffset.y + prevItem.size.height };
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
      const { id, size } = action;
      const nodes = [...state.nodes, {
        id,
        size,
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
      const { id, size, position } = action;
      const sortableItemsCopy = [...state.sortableItems];
      sortableItemsCopy.splice(position, 0, {
        id,
        size,
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
        nodes: state.sortableItems.map(({ id, size }) => ({ id, size })) };
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
    registerNode: (id, size) => dispatch({ type: 'registerNode', id, size }),
    unregisterNode: (id) => dispatch({ type: 'unregisterNode', id }),
    addItem: (id, position, size) => dispatch({ type: 'addItem', id, size, position }),
    removeItem: (id) => dispatch({ type: 'removeItem', id }),
    moveItem: (id, position) => dispatch({ type: 'moveItem', id, position }),
    init: (parentRect: ClientRect) => dispatch({ type: 'init', parentRect }),
    commit: () => dispatch({ type: 'commit' }),
    reset: () => dispatch({ type: 'reset' }),
    getItem: id => getItem(state, id),
    getItems: () => state.sortableItems,
    getItemOffset: id => getItemOffset(state, id),
    getItemPosition: id => getItemPosition(state, id),
    getPositionDelta: id => getItemPosition(state, id) - getInitialItemPosition(state, id),
    getItemPositions: () => getItemPositions(state),
  }), [state]);

  return actions;
}