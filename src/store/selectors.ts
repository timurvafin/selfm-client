import { RootState } from './models';
import { createSelector } from 'reselect';
import { ID } from '../common/types';
import { ProjectEntity } from './models/project';
import { TaskEntity } from './models/task';
import { Completable, EntitiesArray, EntitiesMap } from './models/common';
import { SectionEntity } from './models/section';
import { List, Set } from 'immutable';
import { WorkspaceEntity, workspaceSelectors } from './models/workspace';
import { WorkspaceTypes } from '../common/constants';


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

export const projectOpenIdSelector = (state: RootState): ID => {
  const openId = state.projects.ui.openId;
  const project = state.projects.entities.find(p => p.id === openId);

  return project ? openId : null;
};

/**
 * Task entities by projectId and sectionId
 */
const projectTasksEntitiesSelector = createSelector(
  (state: RootState) => state.tasks.entities,
  (_, workspace: WorkspaceEntity) => workspace,
  (_, __, sectionId) => sectionId,
  (entities: EntitiesMap<TaskEntity>, workspace) => {
    if (!workspace) {
      return [];
    }

    return entities.filter(p => {
      if (workspace.type === WorkspaceTypes.PROJECT) {
        return p.parentId === workspace.id;
      }

      return true;
    });
  }
);

export const tasksSelector = createSelector(
  projectTasksEntitiesSelector,
  (state: RootState) => state.tasks.ui,
  (taskEntities: EntitiesMap<TaskEntity>, tasksUI, selectedProjectTag?: string): EntitiesArray<TaskUIEntity> => {
    let entities = taskEntities.sort((a, b) => a.order - b.order);

    if (selectedProjectTag) {
      entities = entities.filter((task: TaskEntity) => task.tags.includes(selectedProjectTag));
    }

    const uiEntities = entities.map(task => ({
      ...task,
      isOpen: task.id === tasksUI.openId,
      isSelected: task.id === tasksUI.selectedId,
      progress: calculateProgress(task, List(task.todoList)),
    }));

    return [...uiEntities.values()];
  }
);

export const tagsSelector = createSelector(
  projectTasksEntitiesSelector,
  (tasks: EntitiesMap<TaskEntity>): Array<string> => {
    const allTags = tasks.reduce((tags, task) => tags.union(task.tags), Set());

    return allTags.toArray();
  }
);

export const projectSelector = createSelector(
  (state: RootState) => state.projects.entities,
  (state: RootState) => state.projects.ui,
  (state: RootState) => state.tasks.entities,
  (_, id) => id,
  (projectEntities, projectsUI, taskEntities, id) => {
    const project = projectEntities.find(p => p.id === id);

    if (!project) {
      return null;
    }

    const isOpen = project.id === projectsUI.openId;

    return {
      ...project,
      isOpen,
      isSelected: isOpen,
      progress: calculateProgress(project, taskEntities.filter(task => task.parentId === id).toList()),
    };
  }
);

export const projectsSelector = createSelector(
  (state: RootState) => state.projects.entities,
  (state: RootState) => state.projects.ui,
  (state: RootState) => state.tasks.entities,
  (projectEntities, projectsUI, taskEntities) => {
    const projects = projectEntities.map((project) => ({
      ...project,
      isOpen: project.id === projectsUI.openId,
      isSelected: project.id === projectsUI.openId,
      progress: calculateProgress(project, taskEntities.filter(task => task.parentId === project.id).toList()),
    }));

    return [...projects.values()];
  }
);

export const taskSectionsSelector = createSelector(
  (state: RootState) => state.sections.entities,
  (_, parentId) => parentId,
  workspaceSelectors.selectedTag,
  (entities: EntitiesMap<SectionEntity>, parentId, selectedTag) => {
    const sections = entities.filter(p => p.parentId == parentId);
    return [...sections.values()];
  }
);

export const sectionSelector = createSelector(
  (state: RootState) => state.sections.entities,
  (_, id) => id,
  (entities: EntitiesMap<SectionEntity>, id) => entities.get(id)
);

