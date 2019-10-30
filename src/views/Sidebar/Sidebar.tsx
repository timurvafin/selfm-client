import React from 'react';
import { Link } from 'react-router-dom';
import cs from 'classnames';
import Action from 'components/Action';
import RadialProgressBar from 'components/RadialProgressBar';
import { useSelector } from 'react-redux';
import { projectsSelector } from 'store/selectors';
import { actions as ProjectActions } from 'store/models/project';
import { useActions, useSelectedWorkspace } from 'common/hooks';
import {
  PlusIcon,
} from 'components/Icon';
import { SHORTCUT_CAPTIONS, Shortcuts, WorkspaceTypes } from '../../common/constants';

import  './sidebar.scss';
import { ShortcutIcon } from '../../components/ShortcutIcon/ShortcutIcon';


const ProjectIcon = ({ progress }) => (
  <RadialProgressBar
    size={15}
    progress={progress}
    color="#aaa"
  />
);

const SidebarLink = ({ caption, type, id, isSelected, icon, className }) => {
  const cls = cs('sidebar__link', className,{
    ['sidebar__link--selected']: isSelected,
  });

  return (
    <Link to={`/${type}/${id}`}>
      <div className={cls}>
        <div className="sidebar__link__icon">{icon}</div>
        <div className="sidebar__link__caption">{caption}</div>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const actions = useActions({
    loadProjects: ProjectActions.load,
    createProject: ProjectActions.create,
  });

  const projects = useSelector(projectsSelector);

  const selectedWorkspace = useSelectedWorkspace();
  const isWorkspaceSelected = (type, id) => selectedWorkspace && selectedWorkspace.id === id && selectedWorkspace.type === type;

  return (
    <div className="sidebar">
      <div className="sidebar__shortcuts">
        {Object.values(Shortcuts).map((id) => {
          const caption = SHORTCUT_CAPTIONS[id];

          return (
            <SidebarLink
              key={caption}
              type={WorkspaceTypes.SHORTCUT}
              id={caption}
              icon={<ShortcutIcon id={id} />}
              className={`sidebar__shortcut-${caption}`}
              caption={caption}
              isSelected={isWorkspaceSelected('shortcut', caption)}
            />
          );
        })}
      </div>

      <div className="sidebar__projects">
        {projects.map((project) => (
          <SidebarLink
            key={project.id}
            type={WorkspaceTypes.PROJECT}
            id={project.id}
            caption={project.caption}
            className={`sidebar__project`}
            icon={<ProjectIcon progress={project.progress} />}
            isSelected={isWorkspaceSelected('project', project.id)}
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
