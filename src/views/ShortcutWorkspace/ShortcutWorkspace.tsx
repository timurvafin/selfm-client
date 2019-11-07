/* eslint-disable react/jsx-max-props-per-line */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SHORTCUT_CAPTIONS, SHORTCUT_WORKSPACES } from 'common/constants';
import { isEmpty } from 'common/utils/collection';
import { ModelsState } from 'models';
import { tasksSelector, TaskUIEntity } from 'store/selectors';
import { taskActions } from '../../models/task';
import { DNDDestinationItem, DNDSourceItem } from '../../vendor/dnd';
import { ShortcutIcon } from './ShortcutIcon';
import { Layouts as Workspace, Tags as WorkspaceTags, DroppableTaskList } from '../Workspace';
import './style.scss';


const EmptyShortcutContent = ({ code }) => (
  <div className={'workspace-empty-content'}>
    <ShortcutIcon
      code={code}
      size={'70px'}
      color={'#eee'}
    />
  </div>
);

const ProjectName = ({ id }) => {
  const project = useSelector((state: ModelsState) => state.projects.entities.get(id));

  return (
    <div className="project-name">{project.caption}</div>
  );
};

const ShortcutWorkspace = ({ code }) => {
  const caption = SHORTCUT_CAPTIONS[code];
  const workspace = SHORTCUT_WORKSPACES[code];
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));
  const woParent = [];
  const groups = tasks.reduce((map, task) => {
    if (!task.parentId) {
      woParent.push(task);
      return map;
    }

    if (!map[task.parentId]) {
      map[task.parentId] = [task];
    } else {
      map[task.parentId].push(task);
    }

    return map;
  }, {});
  const parentIds = Object.keys(groups);
  const dispatch = useDispatch();
  const onTaskDrop = useCallback((sourceItem: DNDSourceItem, destinationItem: DNDDestinationItem) => {
    dispatch(taskActions.move(sourceItem.id, {
      position: destinationItem.index,
    }));
  }, []);

  return (
    <Workspace.Container className={'shortcut'}>
      <Workspace.CaptionRow>
        <ShortcutIcon code={code} className="workspace__icon" />
        <div className="workspace__caption">
          {caption}
        </div>
      </Workspace.CaptionRow>
      <Workspace.Row className="shortcut-row--tags">
        <WorkspaceTags workspace={workspace} />
      </Workspace.Row>
      <Workspace.BodyRow className={'shortcut__body'}>
        {isEmpty(tasks) && <EmptyShortcutContent code={code} />}
        <DroppableTaskList
          id={`task-group-wo-parent`}
          tasks={woParent}
          onTaskDrop={onTaskDrop}
          orderBy={'order2'}
        />
        {parentIds.map(parentId => (
          <div key={parentId} className={'task-group'}>
            { parentId && <ProjectName id={parentId} /> }
            <DroppableTaskList
              id={`task-group-${parentId}`}
              tasks={groups[parentId]}
              onTaskDrop={onTaskDrop}
              orderBy={'order2'}
            />
          </div>
        ))}
      </Workspace.BodyRow>
    </Workspace.Container>
  );
};

export default ShortcutWorkspace;
