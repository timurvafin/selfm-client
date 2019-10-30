import React from 'react';
import { WorkspaceEntity } from '../../store/models/workspace';
import { useSelector } from 'react-redux';
import { ModelsState } from 'store/models';
import { tasksSelector, TaskUIEntity } from 'store/selectors';
import Tags from '../Workspace/Tags';
import TaskList from '../TaskList';
import TasksSection from './TasksSection';
import { useSelectedTag } from '../../common/hooks';
import { Set } from 'immutable';


const TaskGroups = ({ workspace, }: { workspace: WorkspaceEntity }) => {
  const selectedTag = useSelectedTag();
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));
  const filteredByTag = tasks.filter(task => !selectedTag || (task.tags && task.tags.includes(selectedTag)));
  const woSection = filteredByTag.filter(task => !task.sectionId);
  const sectionIds = tasks.reduce((ids, { sectionId }) => sectionId ? ids.add(sectionId) : ids, Set()).toJS();

  return (
    <div>
      <div className="project__row project__row--tags">
        <Tags workspace={workspace} />
      </div>

      <div className="project__row">
        <TaskList tasks={woSection} />
      </div>

      { sectionIds.map(sectionId => (
        <div
          key={sectionId}
          className="project__row"
        >
          <TasksSection id={sectionId} />
          <TaskList tasks={filteredByTag.filter(task => task.sectionId === sectionId)} />
        </div>
      )) }
    </div>
  );
};

export default TaskGroups;
