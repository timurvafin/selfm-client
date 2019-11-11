import { UIComponentType } from 'common/constants';
import { workspaceId } from 'common/utils/common';
import { ModelsState } from 'models';
import { sectionActions } from 'models/section';
import { WorkspaceEntity } from 'models/workspace';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { taskSectionsSelector, tasksSelector, TaskUIEntity } from 'store/selectors';
import { SortableTaskList } from 'views/Workspace';
import { isEmpty } from '../../../common/utils/collection';
import { taskActions } from '../../../models/task';
import { DraggableItem } from '../../../vendor/dnd/react-dnd';
import { MoveHandler, Sortable } from '../../../vendor/dnd/react-dnd/sortable';
import TasksSection from './TasksSection';
import * as styles from './task-sections.scss';

interface Props {
  workspace: WorkspaceEntity;
}

const TaskSections = ({ workspace }: Props) => {
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));
  const woSection = tasks.filter(task => !task.sectionId);
  const sections = useSelector(state => taskSectionsSelector(state, workspace));

  const dispatch = useDispatch();
  const onTaskMove: MoveHandler = useCallback((sourceItem: DraggableItem, position: number) => {
    dispatch(taskActions.move(sourceItem.id, {
      sectionId: null,
      position,
    }));
  }, []);

  return (
    <div>
      { !isEmpty(woSection) && (
        <div className={styles.sectionWrapper}>
          <SortableTaskList
            tasks={woSection}
            id={'empty-section-task-list'}
            orderBy={'order'}
            onTaskMove={onTaskMove}
          />
        </div>
      )}

      {sections.map((section, index) => (
        <div
          className={styles.sectionWrapper}
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
  const onMove: MoveHandler = useCallback((sourceItem: DraggableItem, position: number) => {
    if (sourceItem.type === UIComponentType.TASK_SECTION) {
      dispatch(sectionActions.move(sourceItem.id, {
        position,
      }));
    }
  }, []);

  return (
    <Sortable
      id={workspaceId(props.workspace)}
      type={UIComponentType.TASK_GROUP}
      accept={UIComponentType.TASK_SECTION}
      onMove={onMove}
    >
      {({ setRef }) => (
        <div ref={setRef}>
          <TaskSections {...props} />
        </div>
      )}
    </Sortable>
  );
};

export default DroppableTaskGroups;
