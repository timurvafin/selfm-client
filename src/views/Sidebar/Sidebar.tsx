import React from 'react';
import cs from 'classnames';
import Action from 'components/Action';
import RadialProgressBar from 'components/RadialProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { projectsSelector } from 'store/selectors';
import { useActions, useSelectedWorkspace } from 'common/hooks';
import {
  PlusIcon,
} from 'components/Icon';
import { SHORTCUT_CAPTIONS, Shortcuts, WorkspaceTypes } from '../../common/constants';

import  './sidebar.scss';
import { ShortcutIcon } from '../../components/ShortcutIcon/ShortcutIcon';
import { projectActions } from '../../store/models/project';
import { workspaceActions } from '../../store/models/workspace';


const ProjectIcon = ({ progress }) => (
  <RadialProgressBar
    size={15}
    progress={progress}
    color="#aaa"
  />
);

const SidebarLink = ({ caption, onSelect, isSelected, icon, className }) => {
  const cls = cs('sidebar__link', className,{
    ['sidebar__link--selected']: isSelected,
  });

  return (
    <div
      className={cls}
      onClick={onSelect}
    >
      <div className="sidebar__link__icon">{icon}</div>
      <div className="sidebar__link__caption">{caption}</div>
    </div>
  );
};

const Sidebar = () => {
  const actions = useActions({
    loadProjects: projectActions.load,
    createProject: projectActions.create,
  });

  const projects = useSelector(projectsSelector);

  const selectedWorkspace = useSelectedWorkspace();
  const isWorkspaceSelected = (type, id) => selectedWorkspace && selectedWorkspace.id === id && selectedWorkspace.type === type;
  const dispatch = useDispatch();
  const selectWorkspace = (type: 'project' | 'shortcut', id: any) => {
    dispatch(workspaceActions.selectWorkspace(type, id));
  };

  return (
    <div className="sidebar">
      <div className="sidebar__shortcuts">
        {Object.values(Shortcuts).map((id) => {
          const caption = SHORTCUT_CAPTIONS[id];

          return (
            <SidebarLink
              key={id}
              onSelect={() => selectWorkspace(WorkspaceTypes.SHORTCUT, id)}
              icon={<ShortcutIcon id={id} />}
              className={`sidebar__shortcut-${id}`}
              caption={caption}
              isSelected={isWorkspaceSelected(WorkspaceTypes.SHORTCUT, id)}
            />
          );
        })}
      </div>

      <div className="sidebar__projects">
        {projects.map((project) => (
          <SidebarLink
            key={project.id}
            onSelect={() => selectWorkspace(WorkspaceTypes.PROJECT, project.id)}
            caption={project.caption}
            className={`sidebar__project`}
            icon={<ProjectIcon progress={project.progress} />}
            isSelected={isWorkspaceSelected(WorkspaceTypes.PROJECT, project.id)}
          />
        ))}
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
