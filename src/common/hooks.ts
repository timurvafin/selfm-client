import { useEffect, useRef } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { workspaceSelectors } from '../store/models/workspace';


export const useMountEffect = (fn) => useEffect(fn, []);

export const useOutsideClickHandler = <T extends Element>(handler) => {
  const ref = useRef<T>();

  useEffect(
    () => {
      const handleClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      };

      document.addEventListener("click", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
      };
    },
    [handler]
  );

  return ref;
};

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

export const useSelectedWorkspace = () => useSelector(workspaceSelectors.selectedWorkspace);
export const useSelectedTag = () => useSelector(workspaceSelectors.selectedTag);