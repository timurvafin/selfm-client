import React, { useCallback, useState } from 'react';
import { SortableContainer, arrayMove } from 'react-sortable-hoc';
import { TodoEntity } from 'models/task';
import { TodoListProps } from './TodoList';
import * as styles from './todolist.scss';


const asSortable = (TodoList) => {
  const SortableTodoListContainer = SortableContainer(TodoList);

  return function SortableTodoList(props: TodoListProps) {
    const [isSortingActive, setIsSortingActive] = useState(false);

    const moveItem = useCallback(
      (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex > props.todoList.length - 1) {
          return;
        }

        const todoList = arrayMove<TodoEntity>(props.todoList, fromIndex, toIndex);
        props.onChange(todoList);
      },
      [props.todoList]
    );

    const onSortEnd = useCallback(
      ({ oldIndex, newIndex }) => {
        moveItem(oldIndex, newIndex);
        setIsSortingActive(false);
      },
      [moveItem]
    );

    const onSortStart = useCallback(
      () => {
        setIsSortingActive(true);
      },
      []
    );

    return (
      // @ts-ignore
      <SortableTodoListContainer
        {...props}
        useDragHandle
        moveItem={moveItem}
        isSortingActive={isSortingActive}
        onSortStart={onSortStart}
        onSortEnd={onSortEnd}
        lockAxis={'y'}
        helperClass={styles.dragging}
        lockToContainerEdges
        transitionDuration={200}
      />
    );
  };
};

export default asSortable;
