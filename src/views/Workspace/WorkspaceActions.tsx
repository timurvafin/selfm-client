import React from 'react';
import cs from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  TrashIcon,
  ListIcon,
  MoreIcon,
  ArrowRightIcon,
} from 'components/Icon';
import Action from 'components/Action';
import { useSelectedWorkspace } from 'common/hooks';
import { WorkspaceTypes } from 'common/constants';
import { taskActions } from 'models/task';
import { workspaceActions, WorkspaceEntity, workspaceSelectors } from 'models/workspace';
import { sectionActions } from 'models/section';
import * as styles from './workspace.scss';

const WorkspaceActions = () => {
  // @ts-ignore
  const workspace: WorkspaceEntity = useSelectedWorkspace();
  const selectedTaskId = useSelector(workspaceSelectors.selectedTaskId);
  const dispatch = useDispatch();

  const addTask = () => {
    dispatch(taskActions.create(workspace, null));
  };
  const addSection = () => {
    dispatch(sectionActions.create(workspace));
  };
  const removeTask = () => {
    dispatch(taskActions.remove(selectedTaskId));
    dispatch(workspaceActions.setTaskSelected(selectedTaskId, false));
  };

  const taskActionElems = [
    <Action
      key={'move'}
      action={addTask}
      className={styles.action}
      icon={<ArrowRightIcon />}
    />,
    <Action
      key={'remove'}
      action={removeTask}
      className={cs(styles.action, styles.actionRemove)}
      icon={<TrashIcon />}
    />,
    <Action
      key={'more'}
      action={addTask}
      className={styles.action}
      icon={<MoreIcon />}
    />
  ];

  return (
    <div className={styles.actions}>
      {selectedTaskId && taskActionElems}
      {!selectedTaskId && (
        <Action
          action={addTask}
          className={styles.action}
          icon={<PlusIcon />}
        />
      )}
      {workspace && workspace.type === WorkspaceTypes.PROJECT && !selectedTaskId && (
        <Action
          action={addSection}
          className={styles.action}
          icon={<ListIcon />}
        />
      )}
    </div>
  );
};

export default WorkspaceActions;
