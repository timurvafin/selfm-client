import React, { useCallback, useMemo, useState } from 'react';
import TextField from 'components/Textfield';
import Checkbox from 'components/Checkbox';
import { KeyCode } from 'common/constants';
import cs from 'classnames';
import { useDispatch } from 'react-redux';
import { taskActions, TodoEntity } from 'models/task';
import { ID } from 'common/types';

import './todolist.scss';


const TodoItem = ({ onRemove, onCreate, onUpdate, todo, autoFocus }) => {
  const { caption, completed } = todo;

  const cls = cs('todo', {
    ['todo--done']: completed,
  });

  const onKeyDown = useCallback(
    (e) => {
      if (e.keyCode === KeyCode.BACKSPACE) {
        if (!e.target.value) {
          e.preventDefault();
          onRemove();
        }
      } else if (e.keyCode === KeyCode.ENTER) {
        onCreate();
      }
    },
    [onRemove],
  );

  return (
    <div className={cls}>
      <Checkbox
        className="todo__checkbox"
        value={completed}
        onChange={completed => onUpdate({ completed })}
      />

      <TextField
        autoFocus={autoFocus}
        className="todo__caption"
        onChange={caption => onUpdate({ caption })}
        onKeyDown={onKeyDown}
        value={caption}
      />
    </div>
  );
};

interface Props {
  parentId: ID;
  todoList: Array<TodoEntity>;
}

const TodoList = ({ todoList, parentId }: Props) => {
  const dispatch = useDispatch();
  const [isAutoFocusEnabled, setAutoFocusEnabled] = useState(false);

  const actions = useMemo(
    () => ({
      create: () => {
        setAutoFocusEnabled(true);
        dispatch(taskActions.createTodo(parentId));
      },
      update: (id, values) => {
        dispatch(taskActions.updateTodo(parentId, id, values));
      },
      remove: (id) => {
        dispatch(taskActions.removeTodo(parentId, id));
        setAutoFocusEnabled(true);
      },
    }),
    [todoList]
  );

  const todoItems = (todoList || []).map((todo, index, array) => {
    const isLast = index === array.length - 1;

    return (
      <TodoItem
        key={index}
        todo={todo}
        autoFocus={isAutoFocusEnabled && isLast}
        onCreate={actions.create}
        onUpdate={actions.update.bind(null, todo.id)}
        onRemove={actions.remove.bind(null, todo.id)}
      />
    );
  });

  return (
    <div className="todo-list">
      {todoItems}
    </div>
  );
};

export default TodoList;
