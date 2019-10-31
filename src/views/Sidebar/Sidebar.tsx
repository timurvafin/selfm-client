import React from 'react';
import Action from 'components/Action';
import RadialProgressBar from 'components/RadialProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { projectsSelector } from 'store/selectors';
import { useActions, useSelectedWorkspace } from 'common/hooks';
import { PlusIcon } from 'components/Icon';
import { SHORTCUT_CAPTIONS, WorkspaceTypes, SHORTCUT_WORKSPACES } from '../../common/constants';

import './sidebar.scss';
import { ShortcutIcon } from '../../components/ShortcutIcon/ShortcutIcon';
import { projectActions } from '../../store/models/project';
import { workspaceActions, WorkspaceEntity } from '../../store/models/workspace';
import SidebarLink from './SidebarLInk';
import { isWorkspacesEqual } from '../../common/utils/common';


const ProjectIcon = ({ progress }) => (
  <RadialProgressBar
    size={15}
    progress={progress}
    color="#aaa"
  />
);

const shortcutWorkspaceSpecs = Object.values(SHORTCUT_WORKSPACES).map((workspace) => ({
  workspace,
  caption: SHORTCUT_CAPTIONS[workspace.code],
  icon: <ShortcutIcon code={workspace.code} />,
}));

const LinkList = ({ specs, isWorkspaceSelected, selectWorkspace }) => specs.map((spec) => (
  <SidebarLink
    key={`${spec.workspace.type}-${spec.workspace.code}`}
    workspace={spec.workspace}
    onSelect={() => selectWorkspace(spec.workspace)}
    icon={spec.icon}
    className={`sidebar__shortcut-${spec.workspace.code}`}
    caption={spec.caption}
    isSelected={isWorkspaceSelected(spec.workspace)}
  />
));

const Sidebar = () => {
  const actions = useActions({
    loadProjects: projectActions.load,
    createProject: projectActions.create,
  });

  const projects = useSelector(projectsSelector);

  const selectedWorkspace = useSelectedWorkspace();
  const isWorkspaceSelected = (workspace: WorkspaceEntity) => isWorkspacesEqual(workspace, (selectedWorkspace as WorkspaceEntity));
  const dispatch = useDispatch();
  const selectWorkspace = (workspace: WorkspaceEntity) => {
    dispatch(workspaceActions.selectWorkspace(workspace));
  };

  const projectsSpecs = projects.map((project) => ({
    workspace: { type: WorkspaceTypes.PROJECT, code: project.id },
    caption: project.caption,
    icon: <ProjectIcon progress={project.progress} />,
  }));

  return (
    <div className="sidebar">
      <div className="sidebar__shortcuts">
        <LinkList
          specs={shortcutWorkspaceSpecs}
          selectWorkspace={selectWorkspace}
          isWorkspaceSelected={isWorkspaceSelected}
        />
      </div>

      <div className="sidebar__projects">
        <LinkList
          specs={projectsSpecs}
          selectWorkspace={selectWorkspace}
          isWorkspaceSelected={isWorkspaceSelected}
        />
      </div>

      <div className="sidebar__actions">
        <Action
          name="New project"
          icon={<PlusIcon />}
          action={actions.createProject}
          className="sidebar__action sidebar__action--add"
        />
      </div>
    </div>
  );
};

export default Sidebar;
