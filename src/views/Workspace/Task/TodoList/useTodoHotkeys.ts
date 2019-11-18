import useHotkeys, { Hotkeys } from 'common/hooks/useHotkeys';
import React from 'react';


const useTodoHotkeys = (actions, todoList, focusedPosition) => {
  return useHotkeys({
    [Hotkeys.ENTER]: () => {
      actions.create(focusedPosition + 1);
      actions.focusPosition(focusedPosition + 1);
    },
    [Hotkeys.SHIFT_ENTER]: () => {
      actions.create(focusedPosition);
      actions.focusPosition(focusedPosition);
    },
    [Hotkeys.BACKSPACE]: (e: React.KeyboardEvent<any>) => {
      // @ts-ignore
      const isEmpty = !e.target.value;

      if (isEmpty) {
        const uid = todoList[focusedPosition].uid;

        actions.remove(uid);
        actions.focusPrev();
      }

      return !isEmpty;
    },
    [Hotkeys.MOVE_UP]: () => {
      actions.moveItem(focusedPosition, focusedPosition - 1);
      actions.focusPrev();
    },
    [Hotkeys.MOVE_DOWN]: () => {
      actions.moveItem(focusedPosition, focusedPosition + 1);
      actions.focusNext();
    },
    [Hotkeys.UP]: () => {
      actions.focusPrev();
    },
    [Hotkeys.DOWN]: () => {
      actions.focusNext();
    },
  });
};

export default useTodoHotkeys;