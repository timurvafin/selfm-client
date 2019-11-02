import React, { useCallback } from 'react';
import { WorkspaceEntity } from 'models/workspace';
import { useDispatch, useSelector } from 'react-redux';
import { ModelsState } from 'models';
import { taskSectionsSelector, tasksSelector, TaskUIEntity } from 'store/selectors';
import Droppable from 'vendor/dnd/beautiful-dnd/Droppable';
import { DNDSourceItem } from 'vendor/dnd';
import { workspaceId } from 'common/utils/common';
import { sectionActions } from 'models/section';
import { DNDDestinationItem } from 'vendor/dnd/types';
import { UIComponentType } from 'common/constants';
import TasksSection from './TasksSection';
import { Layouts as Workspace, TaskList } from 'views/Workspace';


interface Props {
  workspace: WorkspaceEntity;
}

const TaskSections = ({ workspace }: Props) => {
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));
  const woSection = tasks.filter(task => !task.sectionId);
  const sections = useSelector(state => taskSectionsSelector(state, workspace));

  return (
    <div>
      <Workspace.Row >
        <TaskList
          tasks={woSection}
          sectionId={null}
        />
      </Workspace.Row>

      { sections.map((section, index) => (
        <Workspace.Row
          key={section.id}
        >
          <TasksSection
            id={section.id}
            index={index}
            tasks={tasks.filter(task => task.sectionId == section.id)}
          />
        </Workspace.Row>
      )) }
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
