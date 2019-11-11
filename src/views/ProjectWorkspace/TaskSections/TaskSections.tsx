import { UIComponentType } from 'common/constants';
import { workspaceId } from 'common/utils/common';
import { ModelsState } from 'models';
import { sectionActions } from 'models/section';
import { WorkspaceEntity } from 'models/workspace';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { taskSectionsSelector, tasksSelector, TaskUIEntity } from 'store/selectors';
import { isEmpty } from '../../../common/utils/collection';
import { DropHandler, DropResult, Sortable } from '../../../vendor/dnd/react-dnd/sortable';
import TasksSection from './TasksSection';
import * as styles from './task-sections.scss';

interface Props {
  workspace: WorkspaceEntity;
}

const TaskSections = ({ workspace }: Props) => {
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));
  const woSection = tasks.filter(task => !task.sectionId);
  const sections = useSelector(state => taskSectionsSelector(state, workspace));

  return (
    <div>
      { !isEmpty(woSection) && (
        <div className={styles.sectionWrapper}>
          <TasksSection
            key={'empty'}
            id={null}
            index={0}
            tasks={woSection}
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

const SortableTaskGroups = (props: Props) => {
  const dispatch = useDispatch();
  const onSectionDrop: DropHandler = useCallback((dropResult: DropResult) => {
    if (dropResult.item.type === UIComponentType.TASK_SECTION) {
      dispatch(sectionActions.move(dropResult.item.id, {
        position: dropResult.position,
      }));
    }
  }, []);

  return (
    <Sortable
      id={workspaceId(props.workspace)}
      type={UIComponentType.TASK_GROUP}
      accept={UIComponentType.TASK_SECTION}
      onItemDrop={onSectionDrop}
    >
      {({ setRef }) => (
        <div ref={setRef}>
          <TaskSections {...props} />
        </div>
      )}
    </Sortable>
  );
};

export default SortableTaskGroups;
