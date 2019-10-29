import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskList from '../TaskList';
import TextField from 'components/Textfield';
import Action from 'components/Action';
import RadialProgressBar from 'components/RadialProgressBar';

import Menu from '../Menu';
import './project.scss';
import { projectSelector, ProjectUIEntity, taskSectionsSelector } from 'store/selectors';
import { RootState } from 'store';
import { actions as TaskActions } from 'store/models/task';
import { actions as SectionsActions, SectionEntity } from 'store/models/section';
import { actions as ProjectActions } from 'store/models/project';
import { CheckIcon, CrossIcon, PlusIcon } from '../../components/Icon';
import { ID } from '../../common/types';
import ProjectTags from './ProjectTags';
import TasksSection from './TasksSection';


const Project = ({ id }: { id: ID }) => {
  const project = useSelector<RootState, ProjectUIEntity>(state => projectSelector(state, id));
  const sections = useSelector<RootState, Array<SectionEntity>>(state => taskSectionsSelector(state, id));

  const dispatch = useDispatch();

  const addTask = () => {
    dispatch(TaskActions.create(id, null));
  };
  const addSection = () => {
    dispatch(SectionsActions.create(id));
  };
  const remove = () => {
    dispatch(ProjectActions.remove(id));
  };
  const update = (values) => {
    dispatch(ProjectActions.update(id, values));
  };

  const menuItems = [
    { action: '', name: 'Complete', icon: <CheckIcon /> },
    { action: addTask, name: 'Add task', icon: <PlusIcon /> },
    { action: remove, name: 'Remove', icon: <CrossIcon />, className: 'project__action--remove' },
  ];
  
  return (
    <div
      key={id}
      className="project"
    >
      <div className="project__row project__row--caption">
        <RadialProgressBar
          className="project__progress-bar"
          size="20"
          progress={project.progress}
          color="#cd3d82"
        />

        <TextField
          autosize
          placeholder="Название"
          className="project__name project__name--textfield"
          onChange={caption => update({ caption })}
          value={project.caption}
        />

        <Menu items={menuItems} />
      </div>

      <div className="project__row project__row--notes">
        <TextField
          multiline={true}
          placeholder="Заметки"
          onChange={notes => update({ notes })}
          className="project__notes"
          value={project.notes}
        />
      </div>

      <div className="project__row project__row--tags">
        <ProjectTags projectId={project.id} />
      </div>

      <div className="project__row">
        <TaskList projectId={project.id} />
      </div>

      { sections.map(section => (
        <div
          className="project__row"
          key={section.id}
        >
          <TasksSection
            projectId={project.id}
            section={section}
          />
        </div>
      )) }

      <div className="project__row project__row--actions">
        <Action
          action={addTask}
          className="project__action"
          icon={<PlusIcon />}
          name="New task"
        />
        <Action
          action={addSection}
          className="project__action"
          icon={<PlusIcon />}
          name="New section"
        />
      </div>
    </div>
  );
};

export default Project;