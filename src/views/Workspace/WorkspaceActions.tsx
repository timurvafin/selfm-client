import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  TrashIcon,
  ListIcon,
  MoreIcon,
  ArrowRightIcon,
} from '../../components/Icon';
import Action from '../../components/Action';
import { useSelectedWorkspace } from '../../common/hooks';
import { WorkspaceTypes } from '../../common/constants';
import { taskActions } from '../../store/models/task';
import { workspaceActions, WorkspaceEntity, workspaceSelectors } from '../../store/models/workspace';
import { sectionActions } from '../../store/models/section';


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
      {workspace && workspace.type === WorkspaceTypes.PROJECT && !selectedTaskId && (
        <Action
          action={addSection}
          className="workspace-action"
          icon={<ListIcon />}
        />
      )}
    </div>
  );
};

export default WorkspaceActions;
