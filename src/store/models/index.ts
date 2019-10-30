import projectModelSpec, { projectsNamespace, ProjectsState } from './project';
import taskModelSpec, { tasksNamespace, TasksState } from './task';
import sectionModelSpec, { sectionsNamespace, SectionsState } from './section';
import workspaceModelSpec from './workspace';

import { Model } from './common';


export type ModelsState = {
  [projectsNamespace]: ProjectsState;
  [tasksNamespace]: TasksState;
  [sectionsNamespace]: SectionsState;
}

export const models = [
  new Model(workspaceModelSpec),
  new Model(projectModelSpec),
  new Model(taskModelSpec),
  new Model(sectionModelSpec),
];