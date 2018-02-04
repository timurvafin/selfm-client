import React from 'react'
import cs from 'classnames'
import Icon from './Icon'

import './action.scss'

export default function Action(props) {
    const cls     = cs('action', props.className)
    const iconCls = cs('action__icon', props.iconClassName)

    const icon = props.icon ? <Icon className={iconCls} name={props.icon}/> : ''

    return <div className={cls} onClick={props.action}>
        {icon} <span className="action__name">{props.name}</span>
    </div>
}