import React from 'react'
import cs from 'classnames'
import {ENTER_KEY} from 'src/constants'
import {wrapOnKeyDown} from 'src/utils/component'
import _ from 'lodash/fp'
import TextArea from 'react-textarea-autosize'
import {ESC_KEY} from 'src/constants'

import './textfield.scss'

export default class extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            text: props.text,
        }
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.el.focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            text: nextProps.text || '',
        })
    }

    // hardcode : sideeffects
    onKeyDown(keyCode, e) {
        if (keyCode === ESC_KEY) {
            const target = e.target
            this.setState({text: this.props.text})

            target.value = this.props.text
            target.blur()
        }
    }

    wrapOnKeyDown(onKeyDown, onEnter, onEsc) {
        const onKeyDownWrapped = onKeyDown ? (keyCode, e) => {
            this.onKeyDown(keyCode, e)
            onKeyDown(keyCode, e)
        } : this.onKeyDown.bind(this)

        return wrapOnKeyDown(onKeyDownWrapped, onEnter, onEsc)
    }

    wrapOnBlur(onValueChange, onBlur) {
        if (!onValueChange && !onBlur) {
            return null
        }

        const textFromProps = this.props.text

        return function (e) {
            onBlur && onBlur(e)

            const text = e.target.value

            if (onValueChange && text !== textFromProps) {
                onValueChange(text, e)
            }
        }
    }

    onChange(e) {
        this.setState({text: e.target.value})
    }

    render() {
        const props    = this.props
        const defProps = _.omit([
            'className',
            'onEnter',
            'multiline',
            'onKeyDown',
            'onBlur',
            'onValueChange',
            'onEsc',
            'text',
            'autoFocus'
        ])(props)

        const cls = cs('textfield', props.className, {
            'textfield--multiline': props.multiline
        })

        const {onEnter, onValueChange, onBlur, onEsc, onKeyDown} = this.props

        const commonProps = _.merge({
            className: cls,
            onChange: this.onChange.bind(this),
            value: this.state.text,
            onKeyDown: this.wrapOnKeyDown(onKeyDown, onEnter, onEsc),
            onBlur: this.wrapOnBlur(props.onValueChange, onBlur),
        })(defProps)

        return props.multiline ? <TextArea
            {...defProps}
            {...commonProps}
            className={cls}
            spellCheck={false}
            ref={el => this.el = el}
        /> : <input
            {...defProps}
            {...commonProps}
            ref={el => this.el = el}
            type="text"
            spellCheck={false}
        />
    }
}