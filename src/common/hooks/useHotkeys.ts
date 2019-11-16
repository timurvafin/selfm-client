import React, { useCallback, useRef } from 'react';


// To disable "preventsDefault" - return false from handler
type KeyHandler = (e: React.KeyboardEvent<any>) => boolean | undefined;

type HotkeysSpec = {
  [keysString: string]: KeyHandler;
}

const DELIMETER = '+';

export enum Hotkeys {
  ENTER = 'enter',
  SHIFT_ENTER = 'shift + enter',
  CTRL_ENTER = 'ctrl + enter',
  SPACE = 'space',
  ESCAPE = 'escape',
  BACKSPACE = 'backspace',
  DOWN = 'down',
  UP = 'up',
  NEXT = 'tab',
  PREV = 'shift + tab',
  MOVE_UP = 'ctrl + shift + up',
  MOVE_DOWN = 'ctrl + shift + down',
  SELECT_ALL = 'ctrl + a',
  SELECTION_DOWN = 'shift + down',
  SELECTION_UP = 'shift + up',
  SELECT_TO_START = 'ctrl + shift + home',
  SELECT_TO_END = 'ctrl + shift + end',
}

const SPECIAL_CODES = {
  backspace: 8,
  tab: 9,
  clear: 12,
  enter: 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
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
  shift: 16,
  // altKey
  '⌥': 18,
  alt: 18,
  option: 18,
  // ctrlKey
  '⌃': 17,
  ctrl: 17,
  control: 17,
  // metaKey
  '⌘': 91,
  cmd: 91,
  command: 91,
};

const getKeyCode = keyString =>
  SPECIAL_CODES[keyString.toLowerCase()] ||
  MODIFIER_CODES[keyString.toLowerCase()] ||
  keyString.toUpperCase().charCodeAt(0);

const splitAndTrim = (string, delimeter) => string.split(delimeter).map(str => str.trim());

const makeKeyCodeList = keysString => {
  const keysStrings = splitAndTrim(keysString, ',');

  return keysStrings.map(keysString => {
    const chunks = splitAndTrim(keysString, DELIMETER);

    return chunks.map(getKeyCode);
  });
};

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

  const pressedKeys = useRef({});
  const isPressed = (keyCode) => !!pressedKeys.current[keyCode];

  const onKeyDown = useCallback((e: React.KeyboardEvent<any>) => {
    pressedKeys.current[e.keyCode] = true;

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

  const onKeyUp = useCallback((e: React.KeyboardEvent<any>) => {
    pressedKeys.current[e.keyCode] = false;
  }, [spec]);

  return { onKeyDown, onKeyUp };
};

export default useHotkeys;