import React from 'react'
import cs from 'classnames'

export default class extends React.Component {
    render() {
        const cls = cs('icon', 'icon--' + this.props.name, {
            ['icon--hover-' + this.props.hoverClr]: !!this.props.hoverClr
        }, this.props.className);

        return <i onClick={this.props.onClick} className={cls}></i>
    }
}