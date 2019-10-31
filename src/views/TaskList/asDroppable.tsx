import React from 'react';
import { Droppable, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { Props } from './TaskList';
import { encodeDroppableId } from '../../common/utils/common';


const asDroppable = (TaskList: React.FC<Props>): React.FC<Props> => props => (
  <Droppable
    droppableId={encodeDroppableId('task-list', props.sectionId)}
    type={'TASK'}
  >
    {(provided, snapshot: DroppableStateSnapshot) => (
      <div
        ref={provided.innerRef}
        className={'task-list-container'}
        {...provided.droppableProps}
      >
        <TaskList
          {...props}
          isDraggingOver={snapshot.isDraggingOver}
        />
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default asDroppable;