import React from 'react';
import { UIComponentType } from '../../../common/constants';
import { Draggable } from '../../../vendor/dnd';
import Task, { Props } from './Task';


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