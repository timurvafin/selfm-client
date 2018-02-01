import React from 'react'
import TextField from 'src/components/TextField'
import Checkbox from 'src/components/Checkbox'
import {ESQ_KEY, BACKSPACE_KEY} from 'src/constants'

class TodoItem extends React.Component {
    onKeyDown(todoId, keyCode, e) {
        if (keyCode === BACKSPACE_KEY && !e.target.value) {
            console.log('remove todo', todoId)
            //this.props.removeTodo(todoId)
        }
    }

    render() {
        const {id, caption, completed, createTodo, saveTodo} = this.props;

        return <div className="todo">
            <Checkbox className="todo__checkbox" checked={completed}/>
            <TextField
                autoFocus={!id}
                className="todo__caption"
                onValueChange={saveTodo}
                onEnter={createTodo}
                onKeyDown={this.onKeyDown.bind(this, id)}
                text={caption} />
        </div>;
    }
}

export default class extends React.Component {
    render() {
        const {todos, createTodo} = this.props;

        const todoItems = (todos || []).map((todo, index) => {
            return <TodoItem createTodo={createTodo} key={index} {...todo}/>
        })

        return <div className="todo-list">
            {todoItems}
        </div>
    }
}