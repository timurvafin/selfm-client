import React, { useCallback, useMemo } from 'react';
import { actions as TaskActions } from 'store/models/task';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { RootState } from '../../store';
import { projectTasksSelector, TaskUIEntity } from '../../store/selectors';
import { Props } from './TaskList';
import { EntitiesArray } from '../../store/models/common';
import { ID } from '../../common/types';


const asDroppable = (TaskList: React.FC<Props>): React.FC<Props> => props => {
  const dispatch = useDispatch();
  const tasks = useSelector<RootState, EntitiesArray<TaskUIEntity>>(state => projectTasksSelector(state, props.projectId));
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