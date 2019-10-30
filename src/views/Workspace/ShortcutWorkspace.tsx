import React from 'react';
import { useSelectedTag, useSelectedWorkspace } from '../../common/hooks';
import TasksList from '../TaskList/TaskList';
import { useSelector } from 'react-redux';
import { ModelsState } from '../../store/models';
import { tasksSelector, TaskUIEntity } from '../../store/selectors';
import Tags from './Tags';
import { SHORTCUT_CAPTIONS } from '../../common/constants';
import { ShortcutIcon } from '../../components/ShortcutIcon/ShortcutIcon';
import { isEmpty } from '../../common/utils/collection';


const EmptyShortcutContent = ({ id }) => (
  <div className={'workspace-empty-content'}>
    <ShortcutIcon
      id={id}
      size={'70px'}
      color={'#eee'}
    />
  </div>
);

const ShortcutWorkspace = ({ id }) => {
  const caption = SHORTCUT_CAPTIONS[id];
  const workspace = useSelectedWorkspace();
  const selectedTag = useSelectedTag();
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));
  const filteredByTag = tasks.filter(task => !selectedTag || (task.tags && task.tags.includes(selectedTag)));

  return (
    <div className={'workspace workspace--shortcut'}>
      <div className="workspace__row workspace__row--caption">
        <ShortcutIcon
          id={id}
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
        {isEmpty(filteredByTag) && <EmptyShortcutContent id={id} />}
        <TasksList tasks={filteredByTag} />
      </div>
    </div>
  );
};

export default ShortcutWorkspace;
