import React from 'react'
import cs from 'classnames'
import { makeKeyDownHandler, moveCaretTo } from 'src/utils/component'
import _ from 'lodash/fp'
import TextArea from 'react-textarea-autosize'
import { ESC_KEY, ENTER_KEY } from 'src/constants'

import './textfield.scss'

export default class extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: props.text || '',
            savedValue: props.text
        }

        this.onType    = this.onType.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.el.focus()
            moveCaretTo(this.el, -1)
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            value: props.text || '',
            savedValue: props.text
        })
    }

    onType(e) {
        this.setState({value: e.target.value})
    }

    submit() {
        const {onValueChange} = this.props
        const {value, savedValue} = this.state

        if (onValueChange && value !== savedValue) {
            onValueChange(value, this.el)
        }

        this.setState({
            savedValue: value
        })
    }

    cancel(cb) {
        this.setState(state => ({
            value: state.savedValue
        }), cb)
    }

    // hardcode : sideeffects
    onKeyDown(keyCode) {
        switch (keyCode) {
            case ESC_KEY:
                this.cancel(() => this.el.blur())
                break
            case ENTER_KEY:
                this.submit()
                break

        }
    }

    makeKeyDownHandler() {
        const {onEnter, onEsc, onKeyDown} = this.props

        const onKeyDownWrapped = onKeyDown ? (keyCode, e) => {
            this.onKeyDown(keyCode, e)
            onKeyDown(keyCode, e)
        } : this.onKeyDown

        return makeKeyDownHandler(onKeyDownWrapped, onEnter, onEsc)
    }

    makeBlurHandler() {
        const {onBlur} = this.props

        return e => {
            this.submit()
            onBlur && onBlur(e)
        }
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
            'autoFocus',
            'bindRef'
        ])(props)

        const cls = cs('textfield', props.className, {
            'textfield--multiline': props.multiline
        })

        const commonProps = _.merge({
            className: cls,
            onChange: this.onType,
            value: this.state.value,
            onKeyDown: this.makeKeyDownHandler(),
            onBlur: this.makeBlurHandler(),
            spellCheck: false,
            ref: el => {
                this.el = el
                this.props.bindRef && this.props.bindRef(el)
            }
        })(defProps)

        return props.multiline ? <TextArea
            {...defProps}
            {...commonProps}
        /> : <input
            {...defProps}
            {...commonProps}
            type="text"
        />
    }
}