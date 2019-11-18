import cs from 'classnames';
import { ID } from 'common/types';
import { isEmpty } from 'common/utils/collection';
import { taskActions, TodoEntity } from 'models/task';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import asSortable from './asSortable';
import TodoItem from './TodoItem';

import styles from './todolist.scss';
import useTodoFocus from './useTodoFocus';
import useTodoHotkeys from './useTodoHotkeys';


export interface TodoListProps {
  parentId: ID;
  todoList: Array<TodoEntity>;
  onChange: (todoList: Array<TodoEntity>) => void;
}

interface SortableProps {
  moveItem: (fromPosition: number, toPosition: number) => void;
  isSortingActive: boolean;
}

const useAccent = (todoList) => {
  const accentTodoUid = useMemo(() => {
    if (isEmpty(todoList)) {
      return null;
    }

    const uncompletedTodo = todoList.find(todo => !todo.completed);

    return uncompletedTodo && uncompletedTodo.uid;
  }, [todoList]);

  return accentTodoUid;
};

const TodoList = ({ todoList, isSortingActive, parentId, moveItem }: TodoListProps & SortableProps) => {
  const dispatch = useDispatch();
  const {
    focusedPosition,
    focusNext,
    focusPrev,
    focusPosition,
  } = useTodoFocus(todoList ? todoList.length - 1 : 0);

  const accentUid = useAccent(todoList);

  const actions = {
    create: (position) => {
      dispatch(taskActions.createTodo(parentId, position));
    },
    update: (uid, values) => {
      dispatch(taskActions.updateTodo(parentId, uid, values));
    },
    remove: (uid) => {
      dispatch(taskActions.removeTodo(parentId, uid));
    },
    moveItem,
    focusNext,
    focusPrev,
    focusPosition,
  };

  const onKeyDown = useTodoHotkeys(actions, todoList, focusedPosition);

  const todoItems = (todoList || []).map((todo, index) => {
    const uid = todo.uid;
    const isNew = !todo.caption;
    const isFocused = isNew || focusedPosition === index;

    return (
      <TodoItem
        key={uid}
        index={index}
        accent={accentUid === uid}
        todo={todo}
        isFocused={isFocused}
        onFocus={() => {
          focusPosition(index);
        }}
        onUpdate={actions.update.bind(null, uid)}
        onRemove={actions.remove.bind(null, uid)}
      />
    );
  });

  const cls = cs(styles.list, {
    [styles.isSortingActive]: isSortingActive,
  });

  return (
    <div
      className={cls}
      onKeyDown={onKeyDown}
    >
      {todoItems}
    </div>
  );
};

export default asSortable(TodoList);
