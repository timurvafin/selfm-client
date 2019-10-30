import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Props } from './TaskList';
import { ID } from '../../common/types';
import { taskActions } from '../../store/models/task';


const asDroppable = (TaskList: React.FC<Props>): React.FC<Props> => props => {
  const dispatch = useDispatch();
  const tasks = props.tasks;
  const order = useMemo<Array<ID>>(() => tasks.map(task => task.id), [tasks]);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      const [fromIndex, toIndex] = [result.source.index, result.destination.index];
      const newOrder = [...order];
      newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, order[fromIndex]);

      dispatch(taskActions.reorder(newOrder));
    },
    [order],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={'list'}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <TaskList {...props} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default asDroppable;