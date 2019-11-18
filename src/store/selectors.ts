import { ModelsState } from '../models';
import { createSelector } from 'reselect';
import { ID } from '../common/types';
import { ProjectEntity } from '../models/project';
import { TaskEntity, taskSelectors } from '../models/task';
import { Completable, EntitiesArray, EntitiesMap } from '../models/common';
import { SectionEntity } from '../models/section';
import { List, Set } from 'immutable';
import { WorkspaceEntity, workspaceSelectors } from '../models/workspace';
import { isWorkspacesEqual } from '../common/utils/common';


interface BaseTaskUIEntity {
  isOpen: boolean;
  isSelected: boolean;
  progress: number;
}

export interface ProjectUIEntity extends ProjectEntity, BaseTaskUIEntity {
}

export interface TaskUIEntity extends TaskEntity, BaseTaskUIEntity {
  parentCaption?: string;
  sectionCaption?: string;
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

const projectCaptionsSelector = (state: ModelsState) => {
  return state.projects.entities.map(entity => entity.caption);
};

const taskSectionCaptionsSelector = (state: ModelsState) => {
  return state.sections.entities.map(entity => entity.caption);
};

// by workspace & selected tag
export const tasksSelector = createSelector(
  taskSelectors.byWorkspace,
  workspaceSelectors.openTaskId,
  workspaceSelectors.selectedTaskId,
  workspaceSelectors.selectedTag,
  projectCaptionsSelector,
  taskSectionCaptionsSelector,
  (taskEntities: EntitiesMap<TaskEntity>, openTaskId, selectedTaskId, selectedTag, projectCaptions, sectionCaptions): EntitiesArray<TaskUIEntity> => {
    let entities = taskEntities;

    if (selectedTag) {
      entities = entities.filter((task: TaskEntity) => task.tags && task.tags.includes(selectedTag));
    }

    const uiEntities = entities.map(task => ({
      ...task,
      isOpen: task.id === openTaskId,
      isSelected: task.id === selectedTaskId,
      progress: calculateProgress(task, List(task.todoList)),
      parentCaption: projectCaptions.get(task.parentId),
      sectionCaption: sectionCaptions.get(task.sectionId),
    }));

    return [...uiEntities.values()];
  }
);

export const tagsSelector = createSelector(
  taskSelectors.byWorkspace,
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
    const projects = projectEntities.map((project) => toUIProject(project, taskEntities, projectsUI)).sortBy(s => s.order);

    return [...projects.values()];
  }
);

export const taskSectionsSelector = createSelector(
  (state: ModelsState) => state.sections.entities,
  (_, parent: WorkspaceEntity) => parent,
  workspaceSelectors.selectedTag,
  (entities: EntitiesMap<SectionEntity>, parent: WorkspaceEntity) => {
    const sections = entities.filter(p => isWorkspacesEqual(parent, p.parent)).sortBy(s => s.order);
    return [...sections.values()];
  }
);

export const sectionSelector = createSelector(
  (state: ModelsState) => state.sections.entities,
  (_, id) => id,
  (entities: EntitiesMap<SectionEntity>, id) => entities.get(id)
);

