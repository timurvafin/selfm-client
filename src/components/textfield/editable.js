import React from 'react'
import TextField from './index'
import _ from 'lodash'

export default class EditableCaption extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            edit: props.edit
        }

        this.onClick = this.onCaptionClick.bind(this)
        this.onBlur  = this.onTextFieldBlur.bind(this)
    }

    onCaptionClick() {
        this.setState({
            edit: true
        })

        if (this.props.onEdit) {
            this.props.onEdit()
        }
    }

    onTextFieldBlur() {
        this.setState({
            edit: false
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            edit: nextProps.edit
        })
    }

    renderCaption() {
        return <div className={this.props.captionClass} onClick={this.onClick}>{this.props.text}</div>
    }

    renderTextField() {
        const {textFieldClass} = this.props
        const props = _.omit(this.props, ['onEdit', 'edit', 'captionClass', 'textFieldClass'])

        return <TextField autoFocus className={textFieldClass} onBlur={this.onBlur} {...props}/>
    }

    render() {
        return this.state.edit ? this.renderTextField() : this.renderCaption()
    }
}