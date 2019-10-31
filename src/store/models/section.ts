/* eslint-disable arrow-body-style */
import {
  BaseEntity,
  createActionCreators,
  createUpdateEffect, EntitiesArray,
  EntitiesMap,
  entityBaseReducers, getNextOrder,
  ModelSpec,
} from './common';
import { call, put, select } from '@redux-saga/core/effects';
import * as Api from '../../service/api';
import { List, Map } from 'immutable';
import { ID } from '../../common/types';
import { WorkspaceEntity } from './workspace';
import { isWorkspacesEqual } from '../../common/utils/common';
import { ModelsState } from './index';


export interface SectionEntity extends BaseEntity {
  parent: WorkspaceEntity;
  caption: string;
}

export type SectionsState = {
  entities: EntitiesMap<SectionEntity>;
}

const namespace = 'sections';

const actions = createActionCreators({
  create: (parent: WorkspaceEntity) => ({ parent }),
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
    create: function* ({ parent }) {
      const siblings = yield select((state: ModelsState) => state.sections.entities.filter(s => isWorkspacesEqual(parent, s.parent)));

      const entityToAdd = {
        parent,
        caption: '',
        order: getNextOrder(List(siblings)),
      };

      const entity = yield call(Api.addSection, entityToAdd);
      yield put(actions.add(entity));
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
    remove: function* ({ id }) {
      yield call(Api.removeSection, id);
    },
  },
};

export {
  namespace as sectionsNamespace,
  actions as sectionActions,
};

export default spec;



