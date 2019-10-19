import { BaseModel, ProjectModel, State, TaskModel, TodoModel } from '../index';
import { createSelector } from 'reselect';
import { TasksState } from '../reducers/tasks';
import { TodosState } from '../reducers/todos';


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

const toUIProjectModel = (state: State, project: ProjectModel) => {
  const tasks = project.id ? tasksSelector(state, project.id) : [];

  return {
    ...project,
    isOpen: project.id === projectOpenIdSelector(state),
    isSelected: project.id === projectOpenIdSelector(state),
    progress: calculateProgress(project, tasks),
  };
}

export const projectSelector = (state: State, id: number): ProjectUIModel => {
  const project = state.projects.entities.find(p => p.id === id);

  return toUIProjectModel(state, project);
};

export const projectsSelector = (state: State): Array<ProjectUIModel> => state.projects.entities.map((project) => toUIProjectModel(state, project));


