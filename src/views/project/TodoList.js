import React from 'react'
import TextField from 'src/components/textfield'
import Checkbox from 'src/components/checkbox'
import { BACKSPACE_KEY } from 'src/constants'
import { List, Map } from 'immutable'
import { moveCaretTo } from 'src/utils/component'
import cs from 'classnames'

class TodoItem extends React.Component {
    onKeyDown(keyCode, e) {
        if (keyCode === BACKSPACE_KEY && !e.target.value) {
            e.preventDefault()
            this.props.remove()
        }
    }

    render() {
        const {fields, update, create} = this.props
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
                bindRef={this.props.textFieldRef}
                autoFocus={fields.get('isNew')}
                className="todo__caption"
                onValueChange={caption => update({caption})}
                onEnter={create}
                onKeyDown={this.onKeyDown.bind(this)}
                text={fields.get('caption')}
            />
        </div>
    }
}

export default class TodoList extends React.Component {
    constructor(props) {
        super(props)

        this.childrenNodes = Map()
    }

    // ui sideeffects
    remove(todoId) {
        const todos  = this.props.todos
        const key    = todos.findKey(todo => todo.get('id') === todoId)
        const prevId = key > 0 ? todos.get(key - 1).get('id') : null

        this.childrenNodes.delete(todoId)

        if (prevId) {
            const prevEl = this.childrenNodes.get(prevId)
            prevEl.focus()
            moveCaretTo(prevEl, -1)
        }

        this.props.actions.remove(todoId)
    }

    render() {
        const {todos, actions} = this.props

        const todoItems = (todos || List()).map((todo, index) => {
            const id = todo.get('id')

            return <TodoItem
                textFieldRef={el => this.childrenNodes = this.childrenNodes.set(id, el)}
                create={actions.create}
                update={actions.update.bind(null, id)}
                remove={this.remove.bind(this, id)}
                key={index}
                fields={todo}
            />
        }).toJS()

        return <div className="todo-list">
            {todoItems}
        </div>
    }
}
