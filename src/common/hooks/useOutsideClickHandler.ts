import { useEffect, useRef } from 'react';


const useOutsideClickHandler = <T extends Element>(handler) => {
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

export default useOutsideClickHandler;