import React from 'react'
import TextField from 'src/components/TextField'
import Checkbox from 'src/components/Checkbox'
import { BACKSPACE_KEY } from 'src/constants'
import { List } from 'immutable'
import cs from 'classnames'

class TodoItem extends React.Component {
    onKeyDown(todoId, keyCode, e) {
        if (keyCode === BACKSPACE_KEY && !e.target.value) {
            this.props.remove(todoId)
        }
    }

    render() {
        const { fields, update, create } = this.props
        const id  = fields.get('id')
        const cls = cs('todo', {
            ['todo--done']: fields.get('completed')
        })

        return <div className={cls}>
            <Checkbox
                className="todo__checkbox"
                checked={fields.get('completed')}
                onValueChange={completed => update({completed})}
            />

            <TextField
                autoFocus={fields.get('_new')}
                className="todo__caption"
                onValueChange={caption => update({caption})}
                onEnter={create}
                onKeyDown={this.onKeyDown.bind(this, id)}
                text={fields.get('caption') || ''}/>
        </div>
    }
}

export default class TodoList extends React.Component {
    render() {
        const { todos, actions } = this.props

        const todoItems = (todos || List()).map((todo, index) => {
            return <TodoItem
                create={actions.create}
                update={actions.update.bind(null, todo.get('id'))}
                remove={actions.remove.bind(null, todo.get('id'))}
                key={index}
                fields={todo}
            />
        }).toJS()

        return <div className="todo-list">
            {todoItems}
        </div>
    }
}
