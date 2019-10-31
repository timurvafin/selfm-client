/* eslint-disable arrow-body-style */
import {
  BaseTaskEntity,
  createActionCreators,
  createBaseEntity,
  createUpdateEffect, EntitiesArray,
  EntitiesMap,
  entityBaseReducers, getNextOrder,
  ModelSpec,
} from './common';
import { ID } from '../../common/types';
import { call, put, select } from '@redux-saga/core/effects';
import * as Api from '../../service/api';
import { Map } from 'immutable';
import { ModelsState } from './index';


const namespace = 'projects';

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
  create: (sectionId?: ID) => ({ sectionId }),
  update: (id, fields: Partial<ProjectEntity>) => ({ id, fields }),
  remove: (id: ID) => ({ id }),
  add: (entity: ProjectEntity) => ({ entity }),
  load: () => ({}),
  receive: (entities: EntitiesArray<ProjectEntity>) => ({ entities }),
  // selectTag: (tag: string) => ({ tag }),
  // open: (id: ID) => ({ id }),
}, namespace);

const spec: ModelSpec<ProjectsState, typeof actions> = {
  namespace,
  state: {
    entities: Map<ID, ProjectEntity>(),
    ui: {
      openId: null,
      // selectedTag: null,
    },
  },
  actions,
  reducers: {
    entities: {
      ...entityBaseReducers,
    },
    ui: {
      /*selectTag: (state: ProjectsUIState, { tag }) => {
        return { ...state, selectedTag: tag };
      },*/
      /*open: (state: ProjectsUIState, { id }) => {
        return { ...state, openId: id, selectedTag: null };
      },*/
    },
  },
  effects: {
    * create({ sectionId }) {
      const baseEntity = createBaseEntity();
      const state: ModelsState = yield select();
      const siblings = state.projects.entities.filter(project => project.sectionId == sectionId);

      const entity = {
        ...baseEntity,
        parentId: null,
        sectionId,
        caption: '',
        completed: false,
        placeholder: 'New project',
        order: getNextOrder(siblings.toList()),
      };

      yield put(actions.add(entity));
    },
    * add({ entity }) {
      yield call(Api.add, entity, 'project');
    },
    * load() {
      const projects = yield call(Api.list, 'project');

      if (projects) {
        yield put(actions.receive(projects));
        // yield put(actions.open(projects[0].id));
      }
    },
    update: createUpdateEffect({
      namespace,
      addApi: Api.add,
      updateApi: Api.update,
      updateAction: actions.update,
    }),
    * remove({ id }) {
      yield call(Api.remove, id);
    },
  },
};

export {
  namespace as projectsNamespace,
  actions as projectActions,
};

export default spec;



