import React from 'react';
import { WorkspaceEntity } from '../../store/models/workspace';
import { useSelector } from 'react-redux';
import { ModelsState } from 'store/models';
import { taskSectionsSelector, tasksSelector, TaskUIEntity } from 'store/selectors';
import Tags from '../Workspace/Tags';
import TaskList from '../TaskList';
import TasksSection from './TasksSection';
import { useSelectedTag } from '../../common/hooks';


const TaskGroups = ({ workspace }: { workspace: WorkspaceEntity }) => {
  const selectedTag = useSelectedTag();
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));
  const filteredByTag = tasks.filter(task => !selectedTag || (task.tags && task.tags.includes(selectedTag)));
  const woSection = filteredByTag.filter(task => !task.sectionId);
  const sections = useSelector(state => taskSectionsSelector(state, workspace));

  return (
    <div>
      <div className="project__row project__row--tags">
        <Tags workspace={workspace} />
      </div>

      <div className="project__row">
        <TaskList
          tasks={woSection}
          sectionId={null}
        />
      </div>

      { sections.map(section => (
        <div
          key={section.id}
          className="project__row"
        >
          <TasksSection id={section.id} />
          <TaskList
            tasks={filteredByTag.filter(task => task.sectionId == section.id)}
            sectionId={section.id}
          />
        </div>
      )) }
    </div>
  );
};

export default TaskGroups;
