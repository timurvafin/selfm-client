import React, { MutableRefObject, useCallback, useState } from 'react';
import classnames from 'classnames';
import Action from 'components/Action';
import TextField from 'components/Textfield';
import Checkbox from 'components/Checkbox';
import TodoList from './TodoList/TodoList';
import { useDispatch } from 'react-redux';
import { useOutsideClickHandler } from 'common/hooks';
import { stopPropagation } from 'common/utils/component';
import { CalendarIcon, ListIcon, TagIcon } from 'components/Icon';
import Tags from './Tags/Tags';
import { isEmpty } from 'common/utils/collection';
import { TaskUIEntity } from 'store/selectors';
import { taskActions } from 'models/task';
import { workspaceActions } from 'models/workspace';
import { Draggable, DraggableComponentProps } from 'vendor/dnd';
import { UIComponentType } from 'common/constants';

import './task.scss';


const useActions = ({ id, isOpen, isSelected, completed }: TaskUIEntity) => {
  const dispatch = useDispatch();

  return {
    update: useCallback((values) => {
      dispatch(taskActions.update(id, values));
    }, [id]),
    setComplete: useCallback((completed) => {
      dispatch(taskActions.update(id, { completed }));
    }, [id, completed]),
    /*remove: useCallback(() => {
      dispatch(TaskActions.remove(id));
    }, [id]),*/
    setOpen: useCallback((value) => {
      isOpen !== value && dispatch(workspaceActions.setTaskOpen(id, value));
    }, [isOpen]),
    setSelected: useCallback((value) => {
      value !== isSelected && dispatch(workspaceActions.setTaskSelected(id, value));
    }, [isSelected]),
    createTodo: useCallback(() => {
      dispatch(taskActions.createTodo(id));
    }, [id]),
  };
};

interface Props {
  index: number;
  task: TaskUIEntity;
}

const Task = ({ task, isDragging }: Props & DraggableComponentProps) => {
  const { completed, notes, isOpen, isSelected, caption, isNew } = task;

  const actions = useActions(task);
  const [showTags, setShowTags] = useState(!isEmpty(task.tags));

  const classNames = classnames('task', {
    ['task--open']: isOpen,
    ['task--completed']: completed,
    ['task--selected']: isSelected,
    ['task--dragging']: isDragging,
    // ['task--can-combined']: canCombined,
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

      { showTags && (
        <div className="task__row task__row--tags">
          <Tags
            readonly={!isOpen}
            tags={task.tags}
            onChange={(tags) => actions.update({ tags })}
          />
        </div>
      ) }

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
          { !showTags && (
            <Action
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

const DraggableTask = (props: Props) => (
  <Draggable
    index={props.index}
    id={props.task.id}
    type={UIComponentType.TASK}
    isDisabled={props.task.isOpen}
    className={'task-outer'}
  >
    <Task {...props} />
  </Draggable>
);

export default DraggableTask;