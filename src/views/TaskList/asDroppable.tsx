import React, { useCallback, useMemo } from 'react';
import * as TaskActions from '../../store/actions/tasks';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { State } from '../../store';
import { tasksSelector, TaskUIModel } from '../../store/selectors';


const asDroppable = (TaskList: React.FC<{ projectId }>): React.FC<{ projectId: number }> => props => {
  const dispatch = useDispatch();
  const tasks = useSelector<State, Array<TaskUIModel>>(state => tasksSelector(state, props.projectId));
  const order = useMemo(() => tasks.map(task => task.id), [tasks]);

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

      dispatch(TaskActions.reorder(newOrder));
    },
    [order],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={'list'}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}>
            <TaskList {...props} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default asDroppable;