import React from 'react';
import { useSelector } from 'react-redux';
import { SHORTCUT_CAPTIONS, SHORTCUT_WORKSPACES } from 'common/constants';
import { isEmpty } from 'common/utils/collection';
import { ModelsState } from 'models';
import { tasksSelector, TaskUIEntity } from 'store/selectors';
import { ShortcutIcon } from './ShortcutIcon';
import { Layouts as Workspace, Tags as WorkspaceTags, TaskList } from '../Workspace';
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
  const workspace = SHORTCUT_WORKSPACES.find(w => w.code === code);
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));

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
      <Workspace.BodyRow>
        {isEmpty(tasks) && <EmptyShortcutContent code={code} />}
        <TaskList
          tasks={tasks}
          sectionId={null}
        />
      </Workspace.BodyRow>
    </Workspace.Container>
  );
};

export default ShortcutWorkspace;
