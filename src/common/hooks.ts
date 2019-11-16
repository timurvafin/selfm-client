import { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { workspaceSelectors } from '../models/workspace';


export const useMountEffect = (fn) => useEffect(fn, []);

export const useAutoFocus = (autoFocus, node: HTMLInputElement | undefined) => {
  useEffect(() => {
    if (autoFocus && node) {
      node.focus();
    }
  }, [autoFocus, node]);
};

export function useActions(actions, deps = null): typeof actions {
  const dispatch = useDispatch();
  return useMemo(() => {
    if (Array.isArray(actions)) {
      return actions.map(a => bindActionCreators(a, dispatch));
    }
    return bindActionCreators(actions, dispatch);
  }, deps ? [dispatch, ...deps] : [dispatch]);
}

// todo move outside
export const useSelectedWorkspace = () => useSelector(workspaceSelectors.selectedWorkspace);
export const useSelectedTag = () => useSelector(workspaceSelectors.selectedTag);