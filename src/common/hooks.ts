import { useEffect, useRef } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { useRouteMatch, useLocation } from 'react-router-dom';


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

      document.addEventListener("mousedown", handleClick);

      return () => {
        document.removeEventListener("mousedown", handleClick);
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

export const useSelectedWorkspace = () => {
  const match = useRouteMatch('/:type/:id');
  // @ts-ignore
  const selectedWorkspace = match ? { type: match.params.type, id: match.params.id } : null;

  return selectedWorkspace;
};

export const useSelectedTag = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedTag = searchParams.get('tag');

  return selectedTag === 'All' ? null : selectedTag;
};