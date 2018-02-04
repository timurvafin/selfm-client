import React from 'react'
import cs from 'classnames'

export default function Icon(props) {
    const {name, title, onClick, hoverClr, className} = props

    const cls = cs('icon', 'icon--' + name, {
        ['icon--hover-' + hoverClr]: !!hoverClr
    }, className)

    return <i onClick={onClick} className={cls} title={title}></i>
}