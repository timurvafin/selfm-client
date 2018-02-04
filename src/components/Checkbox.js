import React from 'react'
import cs from 'classnames'
import _ from 'lodash/fp'

//import './checkbox.scss'

export default class extends React.Component {
    onChange(e) {
        if (this.props.onValueChange) {
            this.props.onValueChange(e.target.checked)
        }
    }

    render() {
        const defProps = _.omit([
            'className',
            'round',
            'onValueChange',
            'onChange'
        ])(this.props)

        const cls = cs('checkbox', this.props.className, {
            'checkbox--round': this.props.round
        })

        return <input {...defProps} type="checkbox" onChange={this.onChange.bind(this)} className={cls}/>
    }
}