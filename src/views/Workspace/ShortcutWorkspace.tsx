import React from 'react';
import { useSelectedTag } from '../../common/hooks';
import TasksList from '../TaskList/TaskList';
import { useSelector } from 'react-redux';
import { ModelsState } from '../../store/models';
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
  const selectedTag = useSelectedTag();
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));
  const filteredByTag = tasks.filter(task => !selectedTag || (task.tags && task.tags.includes(selectedTag)));

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
        {isEmpty(filteredByTag) && <EmptyShortcutContent code={code} />}
        <TasksList
          tasks={filteredByTag}
          sectionId={'all'}
        />
      </div>
    </div>
  );
};

export default ShortcutWorkspace;
