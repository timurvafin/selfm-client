/* eslint-disable react/jsx-max-props-per-line */
import { ModelsState } from 'models';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { taskActions } from 'models/task';
import { ID } from '../../common/types';
import RadialProgressBar from '../../components/RadialProgressBar';
import { projectSelector, ProjectUIEntity } from '../../store/selectors';
import { DropResult } from '../../vendor/dnd/react-dnd/sortable';
import { SortableTaskList } from '../Workspace';
import ShortcutWorkspaceLayout from './ShortcutWorkspaceLayout';
import styles from './style.scss';


const ProjectHeader = ({ id }) => {
  const project: ProjectUIEntity = useSelector((state: ModelsState) => projectSelector(state, id));

  return (
    <div className={styles.groupHeader}>
      <RadialProgressBar
        size={15}
        progress={project.progress}
        className={styles.groupIcon}
        color="#cd3d82"
      />
      <div className={styles.groupCaption}>{project.caption}</div>
    </div>
  );
};

const AnytimeBody = ({ tasks }) => {
  const woParent = [];
  const groups = tasks.reduce((map, task) => {
    if (!task.parentId) {
      woParent.push(task);
      return map;
    }

    if (!map[task.parentId]) {
      map[task.parentId] = [task];
    } else {
      map[task.parentId].push(task);
    }

    return map;
  }, {});

  const parentIds = Object.keys(groups);
  const dispatch = useDispatch();
  const onTaskDrop = useCallback((taskId: ID, parentId, dropResult: DropResult) => {
    if (dropResult.isNew) {
      dispatch(taskActions.move(taskId, {
        parentId,
      }));
    }

    dispatch(taskActions.reorder(dropResult.newOrder, 'order2'));
  }, []);

  return (
    <>
      <div className={styles.group}>
        <SortableTaskList
          id={`task-group-wo-parent`}
          tasks={woParent}
          onTaskDrop={(taskId, dropResult) => onTaskDrop(taskId, null, dropResult)}
          orderBy={'order2'}
        />
      </div>
      {parentIds.map(parentId => (
        <div key={parentId} className={styles.group}>
          {parentId && <ProjectHeader id={parentId} />}
          <SortableTaskList
            id={`task-group-${parentId}`}
            tasks={groups[parentId]}
            onTaskDrop={(taskId, dropResult) => onTaskDrop(taskId, parentId, dropResult)}
            orderBy={'order2'}
          />
        </div>
      ))}
    </>
  );
};

const AnytimeWorkspace = ({ code }) => (
  <ShortcutWorkspaceLayout code={code}>
    {({ tasks }) => <AnytimeBody tasks={tasks} />}
  </ShortcutWorkspaceLayout>
);

export default AnytimeWorkspace;
