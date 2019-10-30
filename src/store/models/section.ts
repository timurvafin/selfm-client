/* eslint-disable arrow-body-style */
import {
  BaseEntity,
  createActionCreators,
  createBaseEntity,
  createUpdateEffect, EntitiesArray,
  EntitiesMap,
  entityBaseReducers,
  ModelSpec,
} from './common';
import { call, put } from '@redux-saga/core/effects';
import * as Api from '../../service/api';
import { Map } from 'immutable';
import { ID } from '../../common/types';


export interface SectionEntity extends BaseEntity {
  caption: string;
}

export type SectionsState = {
  entities: EntitiesMap<SectionEntity>;
}

const namespace = 'sections';

const actions = createActionCreators({
  create: (parentId: ID) => ({ parentId }),
  add: (entity: SectionEntity) => ({ entity }),
  load: () => ({}),
  receive: (entities: EntitiesArray<SectionEntity>) => ({ entities }),
  update: (id: ID, fields: Partial<SectionEntity>) => ({ id, fields }),
  remove: (id: ID) => ({ id }),
}, namespace);

const spec: ModelSpec<SectionsState, typeof actions> = {
  namespace,
  state: {
    entities: Map<ID, SectionEntity>(),
    // ui: {},
  },
  actions,
  reducers: {
    entities: entityBaseReducers,
  },
  effects: {
    create: function* () {
      const baseEntity = createBaseEntity();
      yield put(actions.add({
        ...baseEntity,
        caption: '',
      }));
    },
    add: function* ({ entity }) {
      yield call(Api.addSection, entity);
    },
    load: function* () {
      const sections = yield call(Api.loadSections);

      yield put(actions.receive(sections));
    },
    update: createUpdateEffect({
      namespace,
      addApi: Api.addSection,
      updateApi: Api.updateSection,
      updateAction: actions.update,
    }),
    remove: function* (id) {
      yield call(Api.removeSection, id);
    },
  },
};

export {
  namespace as sectionsNamespace,
  actions as sectionActions,
};

export default spec;



