/* eslint-disable react/jsx-max-props-per-line */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Shortcut, SHORTCUT_WORKSPACES } from '../../common/constants';
import { ID } from '../../common/types';
import { isEmpty } from '../../common/utils/collection';
import { taskActions } from '../../models/task';
import { TaskUIEntity } from '../../store/selectors';
import { DropResult } from '../../vendor/dnd/react-dnd/sortable';
import { SortableTaskList } from '../Workspace';
import styles from './style.scss';
import ShortcutWorkspaceLayout from './ShortcutWorkspaceLayout';


const makeLabel = (task: TaskUIEntity) => {
  const pieces = [task.parentCaption, task.sectionCaption].filter(caption => caption);

  if (isEmpty(pieces)) {
    return null;
  }

  return pieces.join(' / ');
};

const TodayBody = ({ tasks }) => {
  const dispatch = useDispatch();
  const onTaskDrop = useCallback((taskId: ID, dropResult: DropResult) => {
    dispatch(taskActions.reorder(dropResult.newOrder, 'order2'));
  }, []);

  const createTask = useCallback((caption) => {
    dispatch(taskActions.create(SHORTCUT_WORKSPACES[Shortcut.TODAY], { caption }));
  }, []);

  return (
    <div>
      <SortableTaskList
        id={`task-group-wo-parent`}
        tasks={tasks}
        onTaskDrop={onTaskDrop}
        onTaskCreate={createTask}
        orderBy={'order2'}
        getBottomLabel={task => makeLabel(task)}
      />
    </div>
  );
};


const TodayWorkspace = ({ code }) => (
  <ShortcutWorkspaceLayout code={code}>
    { ({ tasks }) => <TodayBody tasks={tasks} />}
  </ShortcutWorkspaceLayout>
);

export default TodayWorkspace;
