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
import styles from './project.scss';


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
    { action: remove, name: 'Remove', icon: <CrossIcon /> },
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
      className={styles.project}
    >
      <Workspace.CaptionRow>
        <RadialProgressBar
          size={20}
          progress={project.progress}
          color="#cd3d82"
        />

        <Workspace.Caption>
          <TextField
            transparent
            placeholder="Caption"
            className={styles.nameTextfield}
            onChange={caption => update({ caption })}
            value={project.caption}
          />
        </Workspace.Caption>

        <Menu className={styles.menu} items={menuItems} />
      </Workspace.CaptionRow>

      <Workspace.Row className={styles.rowNotes}>
        <TextField
          multiline={true}
          placeholder="Notes"
          onChange={notes => update({ notes })}
          className={styles['notes']}
          value={project.notes}
        />
      </Workspace.Row>

      <Workspace.Row>
        <WorkspaceTags workspace={workspace} />
      </Workspace.Row>

      <Workspace.BodyRow>
        <TaskSections workspace={workspace} />
      </Workspace.BodyRow>
    </Workspace.Container>
  );
};

export default ProjectWorkspace;