import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  TrashIcon,
  ListIcon,
  MoreIcon,
  ArrowRightIcon,
  CopyIcon,
} from '../../components/Icon';
import Action from '../../components/Action';
import { useSelectedWorkspace } from '../../common/hooks';
import { WorkspaceTypes } from '../../common/constants';
import { taskActions } from '../../store/models/task';
import { workspaceSelectors } from '../../store/models/workspace';


const WorkspaceActions = () => {
  const workspace = useSelectedWorkspace();
  const selectedTaskId = useSelector(workspaceSelectors.selectedTaskId);
  const dispatch = useDispatch();

  const addTask = () => {
    dispatch(taskActions.create(workspace, null));
  };
  const removeTask = () => {
    dispatch(taskActions.remove(selectedTaskId));
  };

  const taskActionElems = [
    <Action
      key={'move'}
      action={addTask}
      className="workspace-action"
      icon={<ArrowRightIcon />}
    />,
    <Action
      key={'remove'}
      action={removeTask}
      className="workspace-action workspace-action--remove"
      icon={<TrashIcon />}
    />,
    <Action
      key={'more'}
      action={addTask}
      className="workspace-action"
      icon={<MoreIcon />}
    />
  ];

  return (
    <div className="workspace-actions">
      {selectedTaskId && taskActionElems}
      {!selectedTaskId && (
        <Action
          action={addTask}
          className="workspace-action"
          icon={<PlusIcon />}
        />
      )}
      {workspace.type === WorkspaceTypes.PROJECT && !selectedTaskId && (
        <Action
          action={addTask}
          className="workspace-action"
          icon={<ListIcon />}
        />
      )}
    </div>
  );
};

export default WorkspaceActions;
