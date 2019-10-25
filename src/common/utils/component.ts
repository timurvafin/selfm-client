import { ENTER_KEY, ESC_KEY } from 'common/constants';


export function preventDefaultAnd(fn) {
  return function (e) {
    e.preventDefault();
    
    fn(e);
  };
}

export function makeKeyDownHandler(onKeyDown, onEnter, onEsc) {
  return function (e) {
    if (onKeyDown) {
      onKeyDown(e.keyCode, e);
    }
    
    if (onEnter && e.keyCode === ENTER_KEY) {
      onEnter(e);
    }
    
    if (onEsc && e.keyCode === ESC_KEY) {
      onEsc(e);
    }
  };
}

export function concatHandlers(...handlers) {
  return function (e) {
    handlers.forEach(h => h(e));
  };
}

export const stopPropagation = e => e.stopPropagation();
export const preventDefault = e => e.preventDefault();

export function stopPropagationAnd(fn) {
  return function (e) {
    e.stopPropagation();
    
    fn(e);
  };
}

export function moveCaretTo(inputEl, pos) {
  if (!inputEl) {
    return;
  }
  
  const _pos = (pos >= 0 ? pos : inputEl.value.length + pos) + 1;
  inputEl.setSelectionRange(_pos, _pos);
}