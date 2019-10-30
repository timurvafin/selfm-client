import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from 'components/Textfield';
import RadialProgressBar from 'components/RadialProgressBar';

import Menu from 'components/Menu';
import './project.scss';
import { projectSelector, ProjectUIEntity } from 'store/selectors';
import { ModelsState } from 'store';
import { CheckIcon, CrossIcon } from 'components/Icon';
import { ID } from 'common/types';
import TaskGroups from '../TaskGroups/TaskGroups';
import { WorkspaceTypes } from 'common/constants';
import { projectActions } from '../../store/models/project';


const Project = ({ id }: { id: ID }) => {
  const project = useSelector<ModelsState, ProjectUIEntity>(state => projectSelector(state, id));

  const dispatch = useDispatch();

  /*const addTask = () => {
    dispatch(TaskActions.create(id, null));
  };
  const addSection = () => {
    dispatch(SectionsActions.create(id));
  };*/
  const remove = () => {
    dispatch(projectActions.remove(id));
  };
  const update = (values) => {
    dispatch(projectActions.update(id, values));
  };

  const menuItems = [
    { action: '', name: 'Complete', icon: <CheckIcon /> },
    // { action: addTask, name: 'Add task', icon: <PlusIcon /> },
    { action: remove, name: 'Remove', icon: <CrossIcon />, className: 'project__action--remove' },
  ];

  if (!project) {
    return null;
  }

  return (
    <div
      // need to reinit view
      key={id}
      className="project workspace"
    >
      <div className="workspace__row workspace__row--caption">
        <RadialProgressBar
          size={20}
          progress={project.progress}
          color="#cd3d82"
        />

        <TextField
          autosize
          transparent
          placeholder="Название"
          className="workspace__caption project__name--textfield"
          onChange={caption => update({ caption })}
          value={project.caption}
        />

        <Menu items={menuItems} />
      </div>

      <div className="workspace__row workspace__row--notes">
        <TextField
          multiline={true}
          placeholder="Заметки"
          onChange={notes => update({ notes })}
          className="project__notes"
          value={project.notes}
        />
      </div>

      <div className="workspace__row">
        <TaskGroups workspace={{ type: WorkspaceTypes.PROJECT, id: project.id }} />
      </div>
    </div>
  );
};

export default Project;