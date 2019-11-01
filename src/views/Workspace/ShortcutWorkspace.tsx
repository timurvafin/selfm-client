import React from 'react';
import TasksList from '../TaskList/TaskList';
import { useSelector } from 'react-redux';
import { ModelsState } from '../../models';
import { tasksSelector, TaskUIEntity } from '../../store/selectors';
import Tags from './Tags';
import { SHORTCUT_CAPTIONS, SHORTCUT_WORKSPACES } from '../../common/constants';
import { ShortcutIcon } from '../../components/ShortcutIcon/ShortcutIcon';
import { isEmpty } from '../../common/utils/collection';


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
    <div className={'workspace workspace--shortcut'}>
      <div className="workspace__row workspace__row--caption">
        <ShortcutIcon
          code={code}
          className="workspace__icon"
        />
        <div className="workspace__caption">
          { caption }
        </div>
      </div>
      <div className="workspace__row workspace__row--tags">
        <Tags workspace={workspace} />
      </div>
      <div className="workspace__row workspace__row--body">
        {isEmpty(tasks) && <EmptyShortcutContent code={code} />}
        <TasksList
          tasks={tasks}
          sectionId={'all'}
        />
      </div>
    </div>
  );
};

export default ShortcutWorkspace;
