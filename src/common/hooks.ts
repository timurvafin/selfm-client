import { useEffect, useRef } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

export const useMountEffect = (fn) => useEffect(fn, []);

export const useOutsideClickHandler = <T extends Element>(handler) => {
  const ref = useRef<T>();

  useEffect(
    () => {
      const handleClick = e => {
        if (!ref.current.contains(e.target)) {
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

export function useActions(actions, deps = null) {
  const dispatch = useDispatch();
  return useMemo(() => {
    if (Array.isArray(actions)) {
      return actions.map(a => bindActionCreators(a, dispatch));
    }
    return bindActionCreators(actions, dispatch);
  }, deps ? [dispatch, ...deps] : [dispatch]);
}