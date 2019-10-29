import React, { MutableRefObject, useCallback } from 'react';
import classnames from 'classnames';
import Action from 'components/Action';
import TextField from 'components/Textfield';
import Checkbox from 'components/Checkbox';
import TodoList from './TodoList';
import { useDispatch } from 'react-redux';
import { actions as TaskActions } from 'store/models/task';
import { useOutsideClickHandler } from '../../common/hooks';
import { stopPropagation } from '../../common/utils/component';
import asDraggable from './asDraggable';
import { CalendarIcon, ListIcon, TagIcon, TrashIcon } from '../../components/Icon';
import Tags from './Tags';
import { isEmpty } from '../../common/utils/collection';
import { TaskUIEntity } from '../../store/selectors';


const useActions = ({ id, isOpen, isSelected, completed }: TaskUIEntity) => {
  const dispatch = useDispatch();

  return {
    update: useCallback((values) => {
      dispatch(TaskActions.update(id, values));
    }, [id]),
    setComplete: useCallback((completed) => {
      dispatch(TaskActions.update(id, { completed }));
    }, [id, completed]),
    remove: useCallback(() => {
      dispatch(TaskActions.remove(id));
    }, [id]),
    setOpen: useCallback((value) => {
      isOpen !== value && dispatch(TaskActions.setOpen(id, value));
    }, [isOpen]),
    setSelected: useCallback((value) => {
      value !== isSelected && dispatch(TaskActions.setSelected(id, value));
    }, [isSelected]),
    createTodo: useCallback(() => {
      dispatch(TaskActions.createTodo(id));
    }, [id]),
  };
};

const Task = ({ task }: { task: TaskUIEntity }) => {
  const { completed, notes, isOpen, isSelected, caption, isNew } = task;

  const actions = useActions(task);

  const classNames = classnames('task', {
    ['task--open']: isOpen,
    ['task--completed']: completed,
    // ['task--editable']: editable,
    ['task--selected']: isSelected,
    ['task--dragging']: false,
    ['task--can-drag']: false,
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
    } else {
      actions.setSelected(true);
    }
  };

  return (
    <div
      data-caption={task.caption}
      className={classNames}
      ref={outsideClickHandlerRef}
      onClick={onClick}
      onDoubleClick={() => actions.setOpen(true)}
    >
      <div className="task__row task__row--caption">
        <Checkbox
          value={completed}
          onClick={stopPropagation}
          onChange={actions.setComplete}
          tabIndex={-1}
          className="task__checkbox"
        />
        { isOpen ? (
          <TextField
            transparent
            multiline
            value={caption}
            onMouseDown={stopPropagation}
            tabIndex={-1}
            className="task__caption"
            autoFocus={isNew}
            onChange={caption => actions.update({ caption })}
          />
        ) : (
          <div className="task__caption">{caption}</div>
        )}
      </div>

      <div className="task__row task__row--details">
        <TextField
          multiline
          transparent
          value={notes}
          className="task__notes"
          placeholder="Add notes"
          onChange={notes => actions.update({ notes })}
        />
      </div>

      <div className="task__row task__row--tags">
        <Tags
          readonly={!isOpen}
          tags={task.tags}
          onChange={(tags) => actions.update({ tags })}
        />
      </div>

      <div className="task__row task__row--details">
        <TodoList
          parentId={task.id}
          todoList={task.todoList}
        />
      </div>

      <div className="task__row task__row--controls">
        <div className="task__controls">
          { isEmpty(task.todoList) && (
            <Action
              icon={<ListIcon />}
              hoverClr="blue"
              action={actions.createTodo}
              title="Add todo"
            />
          )}
          <Action
            icon={<CalendarIcon />}
            hoverClr="orange"
            title="Calendar"
            action={actions.createTodo}
          />
          { isEmpty(task.tags) && (
            <Action
              icon={<TagIcon />}
              hoverClr="yellow"
              title="Tag"
              action={actions.createTodo}
            />
          )}
          <Action
            icon={<TrashIcon />}
            hoverClr="red"
            action={actions.remove}
            title="Remove"
          />
        </div>
      </div>
    </div>
  );
};

export default asDraggable(Task);