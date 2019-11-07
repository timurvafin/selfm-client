import { UIComponentType } from 'common/constants';
import { workspaceId } from 'common/utils/common';
import { ModelsState } from 'models';
import { sectionActions } from 'models/section';
import { WorkspaceEntity } from 'models/workspace';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { taskSectionsSelector, tasksSelector, TaskUIEntity } from 'store/selectors';
import { DNDSourceItem } from 'vendor/dnd';
import Droppable from 'vendor/dnd/beautiful-dnd/Droppable';
import { DNDDestinationItem } from 'vendor/dnd/types';
import { DroppableTaskList } from 'views/Workspace';
import { isEmpty } from '../../../common/utils/collection';
import { taskActions } from '../../../models/task';
import TasksSection from './TasksSection';


interface Props {
  workspace: WorkspaceEntity;
}

const TaskSections = ({ workspace }: Props) => {
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));
  const woSection = tasks.filter(task => !task.sectionId);
  const sections = useSelector(state => taskSectionsSelector(state, workspace));

  const dispatch = useDispatch();
  const onTaskDrop = useCallback((sourceItem: DNDSourceItem, destinationItem: DNDDestinationItem) => {
    dispatch(taskActions.move(sourceItem.id, {
      sectionId: null,
      position: destinationItem.index,
    }));
  }, []);

  return (
    <div>
      { !isEmpty(woSection) && (
        <div className={'task-section-wrap'}>
          <DroppableTaskList
            tasks={woSection}
            id={'empty-section-task-list'}
            orderBy={'order'}
            onTaskDrop={onTaskDrop}
          />
        </div>
      )}

      {sections.map((section, index) => (
        <div
          className={'task-section-wrap'}
          key={section.id}
        >
          <TasksSection
            key={section.id}
            id={section.id}
            index={index}
            tasks={tasks.filter(task => task.sectionId == section.id)}
          />
        </div>
      ))}
    </div>
  );
};

const DroppableTaskGroups = (props: Props) => {
  const dispatch = useDispatch();
  const onDrop = useCallback((sourceItem: DNDSourceItem, destinationItem: DNDDestinationItem) => {
    if (sourceItem.type === UIComponentType.TASK_SECTION) {
      dispatch(sectionActions.move(sourceItem.id, {
        position: destinationItem.index,
      }));
    }
  }, []);

  return (
    <Droppable
      id={workspaceId(props.workspace)}
      accept={UIComponentType.TASK_SECTION}
      onDrop={onDrop}
    >
      <TaskSections {...props} />
    </Droppable>
  );
};

export default DroppableTaskGroups;
