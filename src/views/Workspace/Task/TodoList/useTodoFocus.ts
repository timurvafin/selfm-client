import { useState } from 'react';


const useTodoFocus = (maxPosition) => {
  const [focusedPosition, setFocusedPosition] = useState(null);
  const checkBoundaries = position => position >= 0 && position <= maxPosition;

  return {
    focusedPosition,
    focusNext: () => {
      if (checkBoundaries(focusedPosition + 1)) {
        setFocusedPosition(focusedPosition + 1);
      }
    },
    focusPrev: () => {
      if (checkBoundaries(focusedPosition - 1)) {
        setFocusedPosition(focusedPosition - 1);
      }
    },
    focusPosition: (position) => {
      if (checkBoundaries(position)) {
        setFocusedPosition(position);
      }
    },
  };
};

export default useTodoFocus;