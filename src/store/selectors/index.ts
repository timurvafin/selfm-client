import { BaseModel, ProjectModel, State, TaskModel, TasksState, TodoModel, TodosState } from '../index';


interface BaseUIModel {
  isOpen: boolean;
  isSelected: boolean;
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

  return children.filter(todo => todo.completed).length / children.length;
};

export const projectOpenIdSelector = (state: State): number | undefined => {
  const openId = state.projects.ui.openId;
  const project = state.projects.entities.find(p => p.id === openId);

  return project ? openId : null;
};

export const createTasksSelector = (state: State, projectId?: number): Array<TaskUIModel> => {
  if (!projectId) {
    return [];
  }

  const entities = state.tasks.entities.sort((a, b) => a.order - b.order);

  return entities.filter(p => p.parentId === projectId).map(task => ({
    ...task,
    isOpen: task.id === state.tasks.ui.openId,
    isSelected: task.id === state.tasks.ui.selectedId,
    progress: calculateProgress(task, task.todos),
  }));
};

export const projectSelector = (state: State, id: number): ProjectUIModel => {
  const project = state.projects.entities.find(p => p.id === id);
  const tasks = project.id ? createTasksSelector(state, project.id) : [];

  return {
    ...project,
    isOpen: project.id === projectOpenIdSelector(state),
    isSelected: project.id === projectOpenIdSelector(state),
    progress: calculateProgress(project, tasks),
  };
};

export const projectsSelector = (state: State): Array<ProjectUIModel> => state.projects.entities;


