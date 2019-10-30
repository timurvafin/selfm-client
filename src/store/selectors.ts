import { ModelsState } from './models';
import { createSelector } from 'reselect';
import { ID } from '../common/types';
import { ProjectEntity } from './models/project';
import { TaskEntity } from './models/task';
import { Completable, EntitiesArray, EntitiesMap } from './models/common';
import { SectionEntity } from './models/section';
import { List, Set } from 'immutable';
import { WorkspaceEntity, workspaceSelectors } from './models/workspace';
import { Shortcuts, WorkspaceTypes } from '../common/constants';


interface BaseTaskUIEntity {
  isOpen: boolean;
  isSelected: boolean;
  progress: number;
}

export interface ProjectUIEntity extends ProjectEntity, BaseTaskUIEntity {
}

export interface TaskUIEntity extends TaskEntity, BaseTaskUIEntity {
}

const calculateProgress = (entity: Completable, children: List<Completable>) => {
  if (entity.completed) {
    return 1;
  }

  if (!children || children.size <= 0) {
    return 0;
  }

  return children.filter(todo => todo.completed).size / children.size * 100;
};

export const projectOpenIdSelector = (state: ModelsState): ID => {
  const openId = state.projects.ui.openId;
  const project = state.projects.entities.find(p => p.id === openId);

  return project ? openId : null;
};

const shortcutTaskPredicates = {
  [Shortcuts.INBOX]: (task: TaskEntity) => !task.startTime && !task.startTimeTag && !task.parentId,
  [Shortcuts.TODAY]: (task: TaskEntity) => task.startTime && new Date(task.startTime) <= new Date(),
  [Shortcuts.PLANS]: (task: TaskEntity) => !!task.startTime,
  [Shortcuts.ANYTIME]: (task: TaskEntity) => task.startTimeTag === 'anytime',
  [Shortcuts.SOMEDAY]: (task: TaskEntity) => task.startTimeTag === 'someday',
};

const taskEntitiesSelector = createSelector(
  (state: ModelsState) => state.tasks.entities,
  (_, workspace: WorkspaceEntity) => workspace,
  (entities: EntitiesMap<TaskEntity>, workspace) => {
    if (!workspace) {
      return [];
    }

    return entities.filter(entity => {
      if (workspace.type === WorkspaceTypes.PROJECT) {
        return entity.parentId === workspace.id;
      }

      if (workspace.type === WorkspaceTypes.SHORTCUT) {
        return shortcutTaskPredicates[workspace.id](entity);
      }

      return false;
    });
  }
);

export const openTaskIdSelector = (state: ModelsState) => state.tasks.ui.openId;
export const selectedTaskIdSelector = (state: ModelsState) => state.tasks.ui.selectedId;
export const taskSelector = (state: ModelsState, id: ID) => state.tasks.entities.get(id);

export const tasksSelector = createSelector(
  taskEntitiesSelector,
  workspaceSelectors.openTaskId,
  workspaceSelectors.selectedTaskId,
  (taskEntities: EntitiesMap<TaskEntity>, openTaskId, selectedTaskId): EntitiesArray<TaskUIEntity> => {
    const entities = taskEntities.sort((a, b) => a.order - b.order);

    /*if (selectedTag) {
      entities = entities.filter((task: TaskEntity) => task.tags.includes(selectedTag));
    }*/

    const uiEntities = entities.map(task => ({
      ...task,
      isOpen: task.id === openTaskId,
      isSelected: task.id === selectedTaskId,
      progress: calculateProgress(task, List(task.todoList)),
    }));

    return [...uiEntities.values()];
  }
);

export const tagsSelector = createSelector(
  taskEntitiesSelector,
  (tasks: EntitiesMap<TaskEntity>): Array<string> => {
    const allTags = tasks.reduce((tags, task) => tags.union(task.tags), Set());

    return allTags.toArray();
  }
);

const toUIProject = (project: ProjectEntity, tasks: EntitiesMap<TaskEntity>, projectsUI) => {
  const isOpen = project.id === projectsUI.openId;

  return {
    ...project,
    isOpen,
    isSelected: isOpen,
    progress: calculateProgress(project, tasks.filter(task => task.parentId === project.id).toList()),
  };
};

export const projectSelector = createSelector(
  (state: ModelsState) => state.projects.entities,
  (state: ModelsState) => state.projects.ui,
  (state: ModelsState) => state.tasks.entities,
  (_, id) => id,
  (projectEntities, projectsUI, taskEntities, id) => {
    const project = projectEntities.find(p => p.id === id);

    if (!project) {
      return null;
    }

    return toUIProject(project, taskEntities, projectsUI);
  }
);

export const projectsSelector = createSelector(
  (state: ModelsState) => state.projects.entities,
  (state: ModelsState) => state.projects.ui,
  (state: ModelsState) => state.tasks.entities,
  (projectEntities, projectsUI, taskEntities) => {
    const projects = projectEntities.map((project) => toUIProject(project, taskEntities, projectsUI));

    return [...projects.values()];
  }
);

export const taskSectionsSelector = createSelector(
  (state: ModelsState) => state.sections.entities,
  (_, parentId) => parentId,
  workspaceSelectors.selectedTag,
  (entities: EntitiesMap<SectionEntity>, parentId, selectedTag) => {
    const sections = entities.filter(p => p.parentId == parentId);
    return [...sections.values()];
  }
);

export const sectionSelector = createSelector(
  (state: ModelsState) => state.sections.entities,
  (_, id) => id,
  (entities: EntitiesMap<SectionEntity>, id) => entities.get(id)
);

