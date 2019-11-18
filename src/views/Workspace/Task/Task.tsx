import React, { MutableRefObject, ReactNode, useCallback, useEffect, useState } from 'react';
import cs from 'classnames';
import Action from 'components/Action';
import TextField from 'components/Textfield';
import Checkbox from 'components/Checkbox';
import useOutsideClickHandler from 'common/hooks/useOutsideClickHandler';
import { TodoEntity } from 'models/task';
import TodoList from './TodoList/TodoList';
import { stopPropagation } from 'common/utils/component';
import { CalendarIcon, ListIcon, TagIcon } from 'components/Icon';
import Tags from './Tags/Tags';
import { isEmpty } from 'common/utils/collection';
import { TaskUIEntity } from 'store/selectors';

import styles from './task.scss';
import useActions from './useActions';


export interface Props {
  task: TaskUIEntity;
  getBottomLabel?: (task: TaskUIEntity) => ReactNode;
}

const Task = ({ task, getBottomLabel }: Props) => {
  const { completed, notes, isOpen, isSelected, caption, isNew } = task;

  const actions = useActions(task);
  const [showTags, setShowTags] = useState(!isEmpty(task.tags));
  const [captionInputValue, setCaptionInputValue] = useState(caption);

  useEffect(
    () => {
      setShowTags(!isEmpty(task.tags));
    },
    [task]
  );

  const classNames = cs(styles.task, {
    [styles.taskOpen]: isOpen,
    [styles.taskCompleted]: completed,
    [styles.taskSelected]: isSelected,
  });

  const onClickOutside = useCallback(
    () => {
      actions.setOpen(false);
      actions.setSelected(false);
    },
    [actions.setOpen, actions.setSelected]
  );

  const outsideClickHandlerRef: MutableRefObject<HTMLDivElement> = useOutsideClickHandler(onClickOutside);

  const onClick = () => {
    if (isSelected) {
      actions.setOpen(true);
    } else if (!isOpen) {
      actions.setSelected(true);
    }
  };

  const bottomLabel = getBottomLabel && getBottomLabel(task);

  return (
    <div
      className={classNames}
      ref={outsideClickHandlerRef}
      onClick={onClick}
      onDoubleClick={() => actions.setOpen(true)}
    >
      <div className={cs(styles.row, styles.rowCaption)}>
        <Checkbox
          value={completed}
          onClick={stopPropagation}
          onChange={actions.setComplete}
          tabIndex={-1}
          className={styles['checkbox']}
        />
        { isOpen ? (
          <TextField
            transparent
            multiline
            controlled
            value={captionInputValue}
            onChange={setCaptionInputValue}
            onCancel={() => setCaptionInputValue(caption)}
            onMouseDown={stopPropagation}
            tabIndex={-1}
            className={styles['caption']}
            autoFocus={isNew}
            onBlur={() => {
              actions.updateCaption(captionInputValue);
            }}
            onEnter={(e) => {
              actions.updateCaption(captionInputValue);
              e.preventDefault();
              actions.setOpen(false);
            }}
          />
        ) : (
          <div className={styles.captionWrap}>
            <div className={styles['caption']}>{caption}</div>
            { bottomLabel && <div className={styles.bottomLabel}>{bottomLabel}</div> }
          </div>
        )}
      </div>

      <div className={cs(styles.row, styles.rowDetails)}>
        <TextField
          multiline
          transparent
          value={notes}
          className={styles['notes']}
          placeholder="Add notes"
          onChange={notes => actions.update({ notes })}
        />
      </div>

      { showTags && (
        <div className={cs(styles.row, styles.rowTags)}>
          <Tags
            readonly={!isOpen}
            tags={task.tags}
            onChange={(tags) => actions.update({ tags })}
          />
        </div>
      ) }

      <div className={cs(styles.row, styles.rowDetails)}>
        <TodoList
          parentId={task.id}
          todoList={task.todoList}
          onChange={(todoList: Array<TodoEntity>) => actions.update({ todoList })}
        />
      </div>

      <div className={cs(styles.row, styles.rowControls)}>
        <div className={styles['controls']}>
          { isEmpty(task.todoList) && (
            <Action
              className={styles.action}
              icon={<ListIcon />}
              hoverClr="blue"
              action={actions.createTodo}
              title="Add todo"
            />
          )}
          <Action
            className={styles.action}
            icon={<CalendarIcon />}
            hoverClr="orange"
            title="Calendar"
            action={() => {
              actions.createTodo();
            }}
          />
          { !showTags && (
            <Action
              className={styles.action}
              icon={<TagIcon />}
              hoverClr="yellow"
              title="Tag"
              action={() => setShowTags(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Task);