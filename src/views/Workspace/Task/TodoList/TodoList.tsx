import cs from 'classnames';
import { KeyCode } from 'common/constants';
import { ID } from 'common/types';
import TextField from 'components/Textfield';
import { taskActions, TodoEntity } from 'models/task';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isEmpty } from '../../../../common/utils/collection';

import styles from './todolist.scss';


const TodoCheckbox = ({ value, onChange, accent }) => {
  const [isActive, setIsActive] = useState(false);
  const cls = cs(styles.checkbox, {
    [styles.checked]: value,
    [styles.active]: isActive,
    [styles.accent]: accent,
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cls}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => {
        onChange(!value);
        setIsActive(false);
      }}
    >
      <circle
        className={styles.outerCircle}
      />
      <circle
        className={styles.innerCircle}
      />
    </svg>
  );
};

const TodoItem = ({
  onRemove,
  accent,
  onKeyDown,
  onUpdate,
  todo,
  onFocus,
  autoFocus,
}) => {
  const { caption, completed } = todo;

  const cls = cs(styles.todo, {
    [styles.todoDone]: completed,
  });

  return (
    <div className={cls}>
      <TodoCheckbox
        accent={accent}
        value={completed}
        onChange={completed => onUpdate({ completed })}
      />

      <TextField
        autoFocus={autoFocus}
        className={styles.todo__caption}
        onChange={caption => onUpdate({ caption })}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={(e) => {
          if (!e.target.value) {
            onRemove(false);
          }
        }}
        value={caption}
      />
    </div>
  );
};

interface Props {
  autoFocus: boolean;
  parentId: ID;
  todoList: Array<TodoEntity>;
}

const useFocusedPosition = () => {
  const [focusedPosition, setFocusedPosition] = useState(null);

  return {
    focusedPosition,
    focusNext: (position) => {
      setFocusedPosition(position + 1);
    },
    focusPrev: (position) => {
      if (position > 0) {
        setFocusedPosition(position - 1);
      }
    },
    focusPosition: (position) => {
      setFocusedPosition(position);
    },
  };
};

const TodoList = ({ todoList, parentId }: Props) => {
  const dispatch = useDispatch();
  const {
    focusedPosition,
    focusNext,
    focusPrev,
    focusPosition,
  } = useFocusedPosition();

  const accentTodoUid = useMemo(() => {
    if (isEmpty(todoList)) {
      return null;
    }

    const uncompletedTodo = todoList.find(todo => !todo.completed);

    return uncompletedTodo && uncompletedTodo.uid;
  }, [todoList]);

  const actions = useMemo(
    () => ({
      create: (position) => {
        dispatch(taskActions.createTodo(parentId, position));
      },
      update: (uid, values) => {
        dispatch(taskActions.updateTodo(parentId, uid, values));
      },
      remove: (uid) => {
        dispatch(taskActions.removeTodo(parentId, uid));
      },
    }),
    [todoList],
  );

  const keyHandlers = {
    [KeyCode.BACKSPACE]: (e: KeyboardEvent, uid, index) => {
      // @ts-ignore
      if (!e.target.value) {
        e.preventDefault();
        actions.remove(uid);
        focusPrev(index);
      }
    },
    [KeyCode.ENTER]: (e: KeyboardEvent, _, index) => {
      const position = e.shiftKey ? index : index + 1;
      actions.create(position);
      focusPosition(position);
      e.preventDefault();
    },
    [KeyCode.ARROW_UP]: (_, uid, index) => {
      focusPrev(index);
    },
    [KeyCode.ARROW_DOWN]: (_, uid, index) => {
      focusNext(index);
    },
  };

  const onItemKeyDown = useCallback(
    (e, uid, index) => {
      const handler = keyHandlers[e.keyCode];

      if (handler) {
        return handler(e, uid, index);
      }
    },
    [keyHandlers],
  );

  const todoItems = (todoList || []).map((todo, index) => {
    const uid = todo.uid;
    const isNew = !todo.caption;
    const isFocused = isNew || focusedPosition === index;

    return (
      <TodoItem
        key={uid}
        accent={accentTodoUid === uid}
        todo={todo}
        autoFocus={isFocused}
        onKeyDown={(e) => onItemKeyDown(e, uid, index)}
        onFocus={() => {
          focusPosition(null);
        }}
        onUpdate={actions.update.bind(null, uid)}
        onRemove={actions.remove.bind(null, uid)}
      />
    );
  });

  return (
    <div className={styles.list}>
      {todoItems}
    </div>
  );
};

export default TodoList;
