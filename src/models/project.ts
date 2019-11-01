/* eslint-disable arrow-body-style */
import {
  BaseTaskEntity,
  createActionCreators,
  EntitiesMap,
  createBaseEntityReducers,
  getNextOrder,
  ModelSpec,
  createBaseEntityEffects,
  createBaseEntityActions,
} from './common';
import { ID } from '../common/types';
import { call, put, select } from '@redux-saga/core/effects';
import Api from '../service/api';
import { Map } from 'immutable';
import { ModelsState } from './index';
import { workspaceActions } from './workspace';
import { WorkspaceTypes } from '../common/constants';


const namespace = 'projects';
const projectApi = new Api(namespace);

export interface ProjectEntity extends BaseTaskEntity {
  placeholder: string;
}

export interface ProjectsUIState {
  openId?: ID;
  // selectedTag?: string;
}

export type ProjectsState = {
  entities: EntitiesMap<ProjectEntity>;
  ui: ProjectsUIState;
}

const actions = createActionCreators({
  ...createBaseEntityActions<ProjectEntity>(),
  create: (sectionId?: ID) => ({ sectionId }),
  // selectTag: (tag: string) => ({ tag }),
  // open: (id: ID) => ({ id }),
}, namespace);

const spec: ModelSpec<ProjectsState, typeof actions> = {
  namespace,
  state: {
    entities: Map<ID, ProjectEntity>(),
    ui: {
    },
  },
  actions,
  reducers: {
    entities: {
      ...createBaseEntityReducers<ProjectEntity>(),
    },
    ui: {
    },
  },
  effects: {
    ...createBaseEntityEffects(namespace, actions),
    * create({ sectionId }) {
      const state: ModelsState = yield select();
      const siblings = state.projects.entities.filter(project => project.sectionId == sectionId);

      const entityToAdd = {
        parentId: null,
        sectionId,
        caption: '',
        completed: false,
        placeholder: 'New project',
        order: getNextOrder(siblings.toList()),
      };

      const entity: ProjectEntity = yield call(projectApi.add, entityToAdd);
      yield put(actions.add(entity));
      yield put(workspaceActions.selectWorkspace({ type: WorkspaceTypes.PROJECT, code: entity.id }));
    },
  },
};

export {
  namespace as projectsNamespace,
  actions as projectActions,
};

export default spec;



