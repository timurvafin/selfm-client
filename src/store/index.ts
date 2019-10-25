/* eslint-disable @typescript-eslint/no-empty-interface */
import store from './store';
import { TasksState } from './reducers/tasks';
import { ProjectsState } from './reducers/projects';
import { ID } from '../common/types';
import { SectionsState } from './reducers/sections';


export interface BaseModel {
  id?: ID;
  parentId?: ID;
  sectionId?: ID;
  caption: string;
  notes: string;
  order: number;
  completed: boolean;
  isNew?: boolean;
}

export interface SectionModel {
  id: ID;
  parentId?: ID;
  isNew?: boolean;
  caption: string;
}

export interface TodoModel {
  id: ID;
  caption: string;
  completed: boolean;
}

export interface TaskModel extends BaseModel {
  todoList: Array<TodoModel>;
  tags: Array<string>;
}

export interface ProjectModel extends BaseModel {
  placeholder: string;
}

export interface State {
  tasks: TasksState;
  projects: ProjectsState;
  sections: SectionsState;
}

export default store;