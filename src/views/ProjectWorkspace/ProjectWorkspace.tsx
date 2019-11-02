import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from 'components/Textfield';
import RadialProgressBar from 'components/RadialProgressBar';

import Menu from 'components/Menu';
import { projectSelector, ProjectUIEntity } from 'store/selectors';
import { ModelsState } from 'store';
import { CheckIcon, CrossIcon } from 'components/Icon';
import { ID } from 'common/types';
import { WorkspaceTypes } from 'common/constants';
import { projectActions } from 'models/project';
import { Layouts as Workspace, Tags as WorkspaceTags } from '../Workspace';
import TaskSections from './TaskSections';
import './project.scss';


const ProjectWorkspace = ({ id }: { id: ID }) => {
  const dispatch = useDispatch();

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

  const project = useSelector<ModelsState, ProjectUIEntity>(state => projectSelector(state, id));
  if (!project) {
    return null;
  }

  const workspace = { type: WorkspaceTypes.PROJECT, code: project.id };

  return (
    <Workspace.Container
      // need to reinit view
      key={id}
      className="project"
    >
      <Workspace.CaptionRow>
        <RadialProgressBar
          size={20}
          progress={project.progress}
          color="#cd3d82"
        />

        <TextField
          autosize
          transparent
          placeholder="Caption"
          className="workspace__caption project__name--textfield"
          onChange={caption => update({ caption })}
          value={project.caption}
        />

        <Menu items={menuItems} />
      </Workspace.CaptionRow>

      <Workspace.Row className={'project__row--notes'}>
        <TextField
          multiline={true}
          placeholder="Заметки"
          onChange={notes => update({ notes })}
          className="project__notes"
          value={project.notes}
        />
      </Workspace.Row>

      <Workspace.Row className="project__row--tags">
        <WorkspaceTags workspace={workspace} />
      </Workspace.Row>

      <Workspace.BodyRow>
        <TaskSections workspace={workspace} />
      </Workspace.BodyRow>
    </Workspace.Container>
  );
};

export default ProjectWorkspace;