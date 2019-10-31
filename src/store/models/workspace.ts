/* eslint-disable arrow-body-style */
import {
  createActionCreators,
  ModelSpec,
} from './common';
import { DNDItem, ID } from '../../common/types';
import { push } from 'connected-react-router';
import { put, select } from '@redux-saga/core/effects';
import { matchPath } from "react-router";
import { RootState } from '../index';
import { Location } from 'history';
import { taskActions, TaskEntity } from './task';
import { taskSelector } from '../selectors';
import { Shortcut, WorkspaceTypes } from '../../common/constants';


export interface WorkspaceEntity { code: string; type: 'project' | 'shortcut' }

const namespace = 'workspace';

const actions = createActionCreators({
  selectWorkspace: (workspace: WorkspaceEntity) => ({ workspace }),
  selectTag: (tag: string) => ({ tag }),
  setTaskSelected: (taskId: ID, value = true) => ({ taskId, value }),
  setTaskOpen: (taskId: ID, value = true) => ({ taskId, value }),
  performDND: (source: DNDItem, destination: DNDItem) => ({ source, destination }),
}, namespace);

const selectRouterParams = (state: RootState, path) => {
  const location = state.router.location;
  const match = matchPath(location.pathname, { path });
  return match ? match.params : {};
};

const workspacePath = (workspace: WorkspaceEntity | any) => workspace ? `/${workspace.type}/${workspace.code}` : '';

// TODO [impl] check entity existance in selectors in effects
const selectors = {
  selectedTag: (state: RootState) => {
    const location = state.router.location;
    return new URLSearchParams(location.search).get('tag');
  },
  selectedWorkspace: (state: RootState): WorkspaceEntity | {} => {
    const params = selectRouterParams(state, '/:type/:code');
    return params;
  },
  selectedWorkspacePath: (state: RootState) => {
    const workspace = selectors.selectedWorkspace(state);
    return workspacePath(workspace);
  },
  openTaskId: (state: RootState) => {
    const params = selectRouterParams(state, '/:type/:code/:taskId/open');
    // @ts-ignore
    return params.taskId;
  },
  selectedTaskId: (state: RootState) => {
    const params = selectRouterParams(state, '/:type/:code/:taskId/');
    // @ts-ignore
    return params.taskId;
  },
};

const toggleId = (id, value, currentId) => {
  if (value) {
    return id;
  }

  return currentId === id ? null : currentId;
};

const locationSelector = (state: RootState) => state.router.location;

const spec: ModelSpec<{}, typeof actions> = {
  namespace,
  state: {},
  actions,
  effects: {
    selectWorkspace: function* ({ workspace }) {
      yield put(push(workspacePath(workspace)));
    },
    selectTag: function* ({ tag }) {
      const basePath = yield select(selectors.selectedWorkspacePath);
      yield put(push(tag ? `${basePath}?tag=${tag}` : basePath));
    },
    setTaskSelected: function* ({ taskId, value }) {
      const location: Location = yield select(locationSelector);

      const currentTaskId = yield select(selectors.selectedTaskId);
      const nextTaskId = toggleId(taskId, value, currentTaskId);
      const basePath = yield select(selectors.selectedWorkspacePath);

      if (nextTaskId !== currentTaskId) {
        yield put(push({
          ...location,
          pathname: nextTaskId ? `${basePath}/${nextTaskId}/` : basePath,
        }));
      }
    },
    setTaskOpen: function* ({ taskId, value }) {
      const location: Location = yield select(locationSelector);

      const currentTaskId = yield select(selectors.openTaskId);
      const nextTaskId = toggleId(taskId, value, currentTaskId);
      const basePath = yield select(selectors.selectedWorkspacePath);

      if (nextTaskId !== currentTaskId) {
        yield put(push({
          ...location,
          pathname: nextTaskId ? `${basePath}/${nextTaskId}/open` : basePath,
        }));
      }
    },
    performDND: function* ({ source, destination }) {
      if (source.type ==='task') {
        const sourceTask: TaskEntity = yield select(state => taskSelector(state, source.code));

        if (source.scope === 'task-list') {
          if (destination.scope === 'task-list') {
            return yield put(taskActions.move(sourceTask.id, {
              sectionId: destination.code,
              position: destination.index,
            }));
          }

          if (destination.scope === 'sidebar' && destination.type === WorkspaceTypes.PROJECT) {
            return yield put(taskActions.move(sourceTask.id, { parentId: destination.code, sectionId: null }));
          }

          if (destination.scope === 'sidebar' && destination.type === WorkspaceTypes.SHORTCUT) {
            return yield put(taskActions.setShortcut(sourceTask.id, (destination.code as Shortcut)));
          }
        }
      }

      if (source.type === 'project') {

      }
    }
  }
};

export {
  namespace as workspaceNamespace,
  actions as workspaceActions,
  selectors as workspaceSelectors,
};

export default spec;



