import { BaseModel, ProjectModel, State, TaskModel, TodoModel } from '../index';
import { createSelector } from 'reselect';
import { TasksState } from '../reducers/tasks';
import { TodosState } from '../reducers/todos';


interface BaseUIModel {
  isOpen: boolean;
  // isSelected: boolean;
  progress: number;
}

export interface ProjectUIModel extends ProjectModel, BaseUIModel {
}

export interface TaskUIModel extends TaskModel, BaseModel {
}

export interface TodoUIModel extends TodoModel, BaseModel {
}

const calculateProgress = (entity: BaseModel, children: Array<BaseModel> = []) => {
  if (entity.completed) {
    return 1;
  }

  if (children.length <= 0) {
    return 0;
  }

  return children.filter(todo => todo.completed).length / children.length * 100;
};

export const projectOpenIdSelector = (state: State): number | undefined => {
  const openId = state.projects.ui.openId;
  const project = state.projects.entities.find(p => p.id === openId);

  return project ? openId : null;
};

export const tasksSelector = createSelector(
  (state: State) => state.tasks,
  (_, projectId) => projectId,
  (tasks: TasksState, projectId?: number): Array<TaskUIModel> => {
    if (!projectId) {
      return [];
    }

    const entities = tasks.entities.sort((a, b) => a.order - b.order);

    return entities.filter(p => p.parentId === projectId).map(task => ({
      ...task,
      isOpen: task.id === tasks.ui.openId,
      isSelected: task.id === tasks.ui.selectedId,
      progress: calculateProgress(task, task.todos),
    }));
  }
);

export const todoSelector = createSelector(
  (state: State) => state.todos,
  (_, taskId) => taskId,
  (todos: TodosState, taskId?: number): Array<TodoUIModel> => {
    if (!taskId) {
      return [];
    }

    const entities = todos.entities.sort((a, b) => a.order - b.order);

    return entities.filter(p => p.parentId === taskId);
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

    return {
      ...project,
      isOpen: project.id === projectsUI.openId,
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
    progress: calculateProgress(project, taskEntities.filter(task => task.parentId === project.id)),
  }))
);


