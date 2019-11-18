import React, { useCallback } from 'react';


// To disable "preventsDefault" - return false from handler
type KeyHandler = (e: React.KeyboardEvent<any>) => boolean | void;

type HotkeysSpec = {
  [keysString: string]: KeyHandler;
}

const DELIMETER = '+';

export enum Hotkeys {
  ENTER = 'Enter',
  SHIFT_ENTER = 'Shift + Enter',
  CTRL_ENTER = 'Ctrl + Enter',
  SPACE = 'Space',
  ESCAPE = 'Escape',
  BACKSPACE = 'Backspace',
  DOWN = 'Down',
  UP = 'Up',
  NEXT = 'Tab',
  PREV = 'Shift + Tab',
  MOVE_UP = 'Ctrl + Shift + Up',
  MOVE_DOWN = 'Ctrl + Shift + Down',
  SELECT_ALL = 'Ctrl + A',
  SELECTION_DOWN = 'Shift + Down',
  SELECTION_UP = 'Shift + Up',
  SELECT_TO_START = 'Ctrl + Shift + Home',
  SELECT_TO_END = 'Ctrl + Shift + End',
}

const SPECIAL_CODES = {
  Backspace: 8,
  Tab: 9,
  Clear: 12,
  Enter: 13,
  Return: 13,
  Esc: 27,
  Escape: 27,
  Space: 32,
  Left: 37,
  Up: 38,
  Right: 39,
  Down: 40,
  Del: 46,
  Delete: 46,
  Ins: 45,
  Insert: 45,
  Home: 36,
  End: 35,
  Pageup: 33,
  Pagedown: 34,
  Capslock: 20,
  '⇪': 20,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '-': 189,
  '=': 187,
  ';': 186,
  '\'': 222,
  '[': 219,
  ']': 221,
  '\\': 220,
};

const MODIFIER_CODES = {
  // shiftKey
  '⇧': 16,
  Shift: 16,
  // altKey
  '⌥': 18,
  Alt: 18,
  Option: 18,
  // ctrlKey
  '⌃': 17,
  Ctrl: 17,
  Control: 17,
  // metaKey
  '⌘': 91,
  Cmd: 91,
  Command: 91,
};

const getKeyCode = keyString =>
  SPECIAL_CODES[keyString] ||
  MODIFIER_CODES[keyString] ||
  keyString.toUpperCase().charCodeAt(0);

const splitAndTrim = (string, delimeter) => string.split(delimeter).map(str => str.trim());

const makeKeyCodeList = keysString => {
  const keysStrings = splitAndTrim(keysString, ',');

  return keysStrings.map(keysString => {
    const chunks = splitAndTrim(keysString, DELIMETER);

    return chunks.map(getKeyCode);
  });
};

const getKeyCombinationCodes = (e: React.KeyboardEvent<any>) => {
  const pressedKeys = [e.keyCode];
  const modifierKeys = Object.keys(MODIFIER_CODES);

  modifierKeys.forEach(key => {
    if (e.getModifierState(key)) {
      pressedKeys.push(MODIFIER_CODES[key]);
    }
  });

  return pressedKeys;
};

/**
 * Works only with combinations: Multiple modifiers + any key (Ctrl + Shift + A, Shift + Down).
 * Doesn't work with multiple chars (A + B)
 * @param spec
 */
const useHotkeys = (spec: HotkeysSpec) => {
  const handlers = [];

  const keys = Object.keys(spec);
  keys.forEach(key => {
    const codesList = makeKeyCodeList(key);
    codesList.forEach(keyCodes => {
      handlers.push({ keys: keyCodes, handler: spec[key] });
    });
  });

  handlers.sort((a, b) => b.keys.length - a.keys.length);

  const onKeyDown = useCallback((e: React.KeyboardEvent<any>) => {
    const combinationCodes = getKeyCombinationCodes(e);
    const isPressed = (keyCode) => combinationCodes.includes(keyCode);

    for (let i = 0; i < handlers.length; i++) {
      const { keys, handler } = handlers[i];
      const isSuitable = keys.every(isPressed);

      if (isSuitable) {
        const preventDefault = !handler(e);

        if (preventDefault) {
          e.preventDefault();
          return;
        }
      }
    }
  }, [spec]);

  return onKeyDown;
};

export default useHotkeys;