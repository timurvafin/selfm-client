import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MoveIcon } from '../../components/Icon';
import { TaskUIModel } from '../../store/selectors';


const asDraggable = (Task: React.FC<{ task: TaskUIModel }>) => ({ task, index }) => (
  <Draggable
    draggableId={`${task.id}`}
    isDragDisabled={task.isOpen}
    index={index}>
    {provided => (
      <div
        ref={provided.innerRef}
        className={'task-outer'}
        {...provided.draggableProps}>
        { !task.isOpen && <div
          {...provided.dragHandleProps}
          className={'task-outer__drag-handle'}>
          <MoveIcon />
        </div> }
        <Task task={task} />
      </div>
      )}
  </Draggable>
  );

export default asDraggable;