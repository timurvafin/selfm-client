import {ENTER_KEY, ESC_KEY} from 'src/constants'

export function wrapPreventDefault(cb) {
    return function (e) {

        cb(e);
    };
}

export function wrapOnKeyDown(onKeyDown, onEnter, onEsc) {
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
    }
}