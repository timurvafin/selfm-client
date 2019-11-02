import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import cs from 'classnames';
import { TaskUIEntity } from 'store/selectors';
import { Droppable, DNDSourceItem, DroppableComponentProps, DNDDestinationItem } from 'vendor/dnd';
import { taskActions } from 'models/task';
import { UIComponentType } from 'common/constants';
import Task from '../Task';
import './tasks.scss';


export interface Props {
  tasks: Array<TaskUIEntity>;
  sectionId?: string;
}

const TasksList = ({ tasks, isDraggingOver }: Props & DroppableComponentProps) => {
  const cls = cs('task-list', {
    ['task-list--dragging-over']: isDraggingOver,
  });

  return (
    <div className={cls}>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
        />
      ))}
    </div>
  );
};

const DroppableTaskList = (props: Props) => {
  const dispatch = useDispatch();
  const onDrop = useCallback((sourceItem: DNDSourceItem, destinationItem: DNDDestinationItem) => {
    if (sourceItem.type === UIComponentType.TASK) {
      dispatch(taskActions.move(sourceItem.id, {
        sectionId: props.sectionId,
        position: destinationItem.index,
      }));
    }
  }, [props.sectionId]);

  return (
    <Droppable
      id={`task-list-${props.sectionId}`}
      className={'task-list-container'}
      accept={UIComponentType.TASK}
      onDrop={onDrop}
    >
      <TasksList {...props} />
    </Droppable>
  );
};

export default DroppableTaskList;