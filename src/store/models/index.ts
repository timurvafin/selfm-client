import projectModelSpec, { namespace as projectNamespace, ProjectsState } from './project';
import taskModelSpec, { namespace as tasksNamespace, TasksState } from './task';
import sectionModelSpec, { namespace as sectionsNamespace, SectionsState } from './section';
import workspaceModelSpec, { namespace as workspaceNamespace, WorkspaceState } from './workspace';

import { makeReducer, makeSagas, Model } from './common';


export type RootState = {
  [workspaceNamespace]: WorkspaceState;
  [projectNamespace]: ProjectsState;
  [tasksNamespace]: TasksState;
  [sectionsNamespace]: SectionsState;
}

const models = [
  new Model(workspaceModelSpec),
  new Model(projectModelSpec),
  new Model(taskModelSpec),
  new Model(sectionModelSpec),
];

export const reducer = makeReducer(models);
export const sagas = makeSagas(models);