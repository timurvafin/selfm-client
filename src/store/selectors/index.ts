import { BaseModel, ProjectModel, SectionModel, State, TaskModel } from '../index';
import { createSelector } from 'reselect';
import { ID } from '../../common/types';
import { unique } from '../../common/utils/collection';


interface BaseUIModel {
  isOpen: boolean;
  isSelected: boolean;
  progress: number;
}

export interface ProjectUIModel extends ProjectModel, BaseUIModel {
}

export interface TaskUIModel extends TaskModel, BaseModel {
}

const calculateProgress = (entity: BaseModel, children: Array<{ completed: boolean }> = []) => {
  if (entity.completed) {
    return 1;
  }

  if (children.length <= 0) {
    return 0;
  }

  return children.filter(todo => todo.completed).length / children.length * 100;
};

export const projectOpenIdSelector = (state: State): ID => {
  const openId = state.projects.ui.openId;
  const project = state.projects.entities.find(p => p.id === openId);

  return project ? openId : null;
};

export const projectSelectedTagSelector = (state: State): string | undefined => state.projects.ui.selectedTag;

export const projectTasksEntitiesSelector = createSelector(
  (state: State) => state.tasks.entities,
  (_, projectId) => projectId,
  (_, __, sectionId) => sectionId,
  (entities: Array<TaskModel>, projectId, sectionId) => {
    if (!projectId) {
      return [];
    }

    return entities.filter(p => p.parentId === projectId && (p.sectionId == sectionId));
  }
);

export const projectTasksSelector = createSelector(
  projectTasksEntitiesSelector,
  (state: State) => state.tasks.ui,
  projectSelectedTagSelector,
  (taskEntities: Array<TaskModel>, tasksUI, selectedProjectTag?: string): Array<TaskUIModel> => {
    let entities = taskEntities.sort((a, b) => a.order - b.order);

    if (selectedProjectTag) {
      entities = entities.filter((task: TaskModel) => task.tags.includes(selectedProjectTag));
    }

    return entities.map(task => ({
      ...task,
      isOpen: task.id === tasksUI.openId,
      isSelected: task.id === tasksUI.selectedId,
      progress: calculateProgress(task, task.todoList),
    }));
  }
);

export const projectTagsSelector = createSelector(
  projectTasksEntitiesSelector,
  (tasks: Array<TaskModel>): Array<string> => {
    const allTags = tasks.reduce((tags, task) => [...tags, ...task.tags], []);

    return unique(allTags);
  }
);

export const projectSelector = createSelector(
  (state: State) => state.projects.entities,
  (state: State) => state.projects.ui,
  (state: State) => state.tasks.entities,
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
      progress: calculateProgress(project, taskEntities.filter(task => task.parentId === id)),
    };
  }
);

export const projectsSelector = createSelector(
  (state: State) => state.projects.entities,
  (state: State) => state.projects.ui,
  (state: State) => state.tasks.entities,
  (projectEntities, projectsUI, taskEntities) => projectEntities.map((project) => ({
    ...project,
    isOpen: project.id === projectsUI.openId,
    isSelected: project.id === projectsUI.openId,
    progress: calculateProgress(project, taskEntities.filter(task => task.parentId === project.id)),
  }))
);

export const taskSectionsSelector = createSelector(
  (state: State) => state.sections.entities,
  (_, parentId) => parentId,
  projectSelectedTagSelector,
  (entities: Array<SectionModel>, parentId, selectedTag) => {

    return entities.filter(p => p.parentId == parentId);
  }
);


