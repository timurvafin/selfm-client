import React, { useCallback, useMemo, useState } from 'react';
import TextField from 'components/Textfield';
import Checkbox from 'components/Checkbox';
import { KeyCode } from 'common/constants';
import cs from 'classnames';
import { useDispatch } from 'react-redux';
import * as TaskActions from '../../store/actions/tasks';
import { TodoModel } from '../../store';
import { removeById, updateById } from '../../common/utils/collection';


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
  todoList: Array<TodoModel>;
  onChange: (list: Array<TodoModel>) => void;
  create: () => void;
}

const TodoList = ({ todoList, onChange, create }: Props) => {
  const [isAutoFocusEnabled, setAutoFocusEnabled] = useState(false);

  const actions = useMemo(
    () => ({
      create: () => {
        setAutoFocusEnabled(true);
        create();
      },
      update: (id, values) => {
        onChange(updateById(todoList, id, values));
      },
      remove: (id) => {
        onChange(removeById(todoList, id));
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
