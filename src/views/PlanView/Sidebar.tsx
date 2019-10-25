import React from 'react';
import cs from 'classnames';
import Action from 'components/Action';
import RadialProgressBar from 'components/RadialProgressBar';
import { useSelector } from 'react-redux';
import { projectsSelector } from 'store/selectors';
import * as ProjectActions from 'store/actions/projects';
import * as TaskActions from 'store/actions/tasks';
import { useActions, useMountEffect } from 'common/hooks';
import { useDrop } from 'react-dnd';
import { PlusIcon } from 'components/Icon';
import { ID } from '../../common/types';


const ProjectLink = ({ project, onSelect, moveTask }: { onSelect: any; project: any; moveTask: any }) => {
  const [{ isOver }, drop] = useDrop<{ id: ID; type: string }, {}, { isOver: boolean }>({
    accept: 'task',
    drop(taskItem) {
      moveTask(taskItem.id, project.id);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    })
  });

  const classname = cs('sidebar__project', {
    ['sidebar__project--selected']: project.isOpen,
    ['sidebar__project--task-over']: isOver,
  });

  return (
    <div
      ref={drop}
      onMouseDown={onSelect}
      className={classname}>
      <RadialProgressBar
        size="15"
        progress={project.progress}
        color="#aaa"
        className="sidebar__project__progress-bar"
      />
      <div className="sidebar__project__icon">{project.icon}</div>
      <div className="sidebar__project__name">{project.caption || project.placeholder}</div>
    </div>
  );
};

const Sidebar = () => {
  const actions = useActions({
    moveTask: TaskActions.move,
    loadProjects: ProjectActions.load,
    openProject: ProjectActions.open,
    createProject: ProjectActions.create,
  });

  useMountEffect(() => {
    actions.loadProjects();
  });

  const projects = useSelector(projectsSelector);

  return (
    <div className="sidebar">
      <div className="sidebar__projects">
        {projects.map((project) => (
          <ProjectLink
            key={project.id}
            onSelect={() => actions.openProject(project.id)}
            project={project}
            moveTask={actions.moveTask}
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
