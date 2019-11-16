import React from 'react';
import TextField from 'components/Textfield';
import cs from 'classnames';
import { SortableElement as asSortableElement, SortableHandle as asHandle } from 'react-sortable-hoc';
import { MoveIcon } from 'components/Icon';
import TodoCheckbox from './TodoCheckbox';
import styles from './todolist.scss';


const TodoItem = ({
  onRemove,
  accent,
  onUpdate,
  todo,
  onFocus,
  isFocused,
}) => {
  const { caption, completed } = todo;

  const cls = cs(styles.todo, {
    [styles.isDone]: completed,
  });

  return (
    <div
      className={cls}
    >
      <TodoCheckbox
        accent={accent}
        value={completed}
        onChange={completed => {
          onUpdate({ completed });
        }}
      />
      <TextField
        autoFocus={isFocused}
        className={styles.captionInput}
        onChange={caption => onUpdate({ caption })}
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

const DragHandle = asHandle(() => <span className={styles.dragHandle}><MoveIcon /></span>);

const SortableTodoItem = asSortableElement((props) => {
  return (
    <div className={styles.draggable}>
      <DragHandle />
      <TodoItem {...props} />
    </div>
  );
});

export default SortableTodoItem;