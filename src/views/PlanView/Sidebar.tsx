import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import cs from 'classnames';
import Action from 'components/Action';
import RadialProgressBar from 'components/RadialProgressBar';
import { useSelector } from 'react-redux';
import { projectsSelector } from 'store/selectors';
import { actions as ProjectActions } from 'store/models/project';
import { useActions } from 'common/hooks';
import {
  PlusIcon,
  CalendarIcon,
  InboxIcon,
  StarIcon,
  ArchiveIcon,
  LayersIcon,
} from 'components/Icon';
import { Shortcuts, WorkspaceTypes } from '../../common/constants';


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
  const shortcuts = [
    { caption: Shortcuts.INBOX, icon: <InboxIcon className={'icon-inbox'}/> },
    { caption: Shortcuts.TODAY, icon: <StarIcon className={'icon-today'}/> },
    { caption: Shortcuts.PLANS, icon: <CalendarIcon className={'icon-plans'}/> },
    { caption: Shortcuts.ANYTIME, icon: <LayersIcon className={'icon-anytime'}/> },
    { caption: Shortcuts.SOMEDAY, icon: <ArchiveIcon className={'icon-someday'}/> },
  ];

  const match = useRouteMatch('/:type/:id');
  // const selectedWorkspace = useSelector(workspaceSelectors.selectedWorkspace);
  const selectedWorkspace = match ? { type: match.params.type, id: match.params.id } : null;
  const isWorkspaceSelected = (type, id) => selectedWorkspace && selectedWorkspace.id === id && selectedWorkspace.type === type;

  return (
    <div className="sidebar">
      <div className="sidebar__shortcuts">
        {shortcuts.map((shortcut) => (
          <SidebarLink
            key={shortcut.caption}
            type={WorkspaceTypes.SHORTCUT}
            id={shortcut.caption}
            icon={shortcut.icon}
            className={`sidebar__shortcut-${shortcut.caption}`}
            caption={shortcut.caption}
            isSelected={isWorkspaceSelected('shortcut', shortcut.caption)}
          />
        ))}
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
