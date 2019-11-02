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

const ShortcutWorkspace = ({ code }) => {
  const caption = SHORTCUT_CAPTIONS[code];
  const workspace = SHORTCUT_WORKSPACES[code];
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));

  const dispatch = useDispatch();
  const onTaskDrop = useCallback((sourceItem: DNDSourceItem, destinationItem: DNDDestinationItem) => {
    dispatch(taskActions.move(sourceItem.id, {
      position: destinationItem.index,
    }));
  }, []);

  return (
    <Workspace.Container className={'shortcut'}>
      <Workspace.CaptionRow>
        <ShortcutIcon
          code={code}
          className="workspace__icon"
        />
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
          id={`${workspace.code}-task-list`}
          tasks={tasks}
          onTaskDrop={onTaskDrop}
          orderBy={'order2'}
        />
      </Workspace.BodyRow>
    </Workspace.Container>
  );
};

export default ShortcutWorkspace;
