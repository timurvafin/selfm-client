import { useEffect, useRef } from 'react';


export const useMountEffect = (fn) => useEffect(fn, []);

export const useOutsideClickHandler = (handler) => {
  const ref = useRef<Element>();

  useMountEffect(
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
  );

  return ref;
}