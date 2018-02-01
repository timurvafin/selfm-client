import React from 'react'
import cs from 'classnames'
import Icon from './Icon'

import './action.scss'

export default class extends React.Component {
    render() {
        const cls = cs('action', this.props.className);
        const iconCls = cs('action__icon', this.props.iconClassName);

        const icon = this.props.icon ? <Icon className={iconCls} name={this.props.icon} /> : '';

        return <div className={cls} onClick={this.props.action} >
                {icon} <span className="action__name">{this.props.name}</span>
        </div>;
    }
}