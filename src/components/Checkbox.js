import React from 'react'
import cs from 'classnames'
import _ from 'lodash/fp'

//import './checkbox.scss'

export default class extends React.Component {
    render() {
        const defProps = _.omit([
            'className',
            'round'
        ])(this.props);

        const cls = cs('checkbox', this.props.className, {
            'checkbox--round': this.props.round
        });

        return <input {...defProps} type="checkbox" className={cls}/>
    }
}