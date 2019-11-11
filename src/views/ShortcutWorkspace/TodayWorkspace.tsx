/* eslint-disable react/jsx-max-props-per-line */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Shortcut, SHORTCUT_WORKSPACES } from '../../common/constants';
import { ID } from '../../common/types';
import { taskActions } from '../../models/task';
import { DropResult } from '../../vendor/dnd/react-dnd/sortable';
import { SortableTaskList } from '../Workspace';
import styles from './style.scss';
import ShortcutWorkspaceLayout from './ShortcutWorkspaceLayout';


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
