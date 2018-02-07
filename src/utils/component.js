import {ENTER_KEY, ESC_KEY} from 'src/constants'

export function preventDefaultAnd(fn) {
    return function (e) {
        e.preventDefault()

        fn(e)
    }
}

export function wrapOnKeyDown(onKeyDown, onEnter, onEsc) {
    return function (e) {
        if (onKeyDown) {
            onKeyDown(e.keyCode, e)
        }

        if (onEnter && e.keyCode === ENTER_KEY) {
            onEnter(e)
        }

        if (onEsc && e.keyCode === ESC_KEY) {
            onEsc(e)
        }
    }
}

export function stopPropagationAnd(fn) {
    return function (e) {
        e.stopPropagation()
        
        fn(e)
    }
} 