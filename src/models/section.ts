/* eslint-disable arrow-body-style */
import {
  BaseEntity,
  createActionCreators,
  EntitiesMap,
  createBaseEntityReducers,
  getNextOrder,
  ModelSpec,
  createBaseEntityActions,
  createBaseEntityEffects, makeOrderFieldsMap,
} from './common';
import { call, put, select } from '@redux-saga/core/effects';
import Api from '../service/api';
import { List, Map } from 'immutable';
import { ID } from '../common/types';
import { WorkspaceEntity } from './workspace';
import { isUndefined, isWorkspacesEqual } from '../common/utils/common';
import { ModelsState } from './index';
import { sectionSelector } from '../store/selectors';


export interface SectionEntity extends BaseEntity {
  parent: WorkspaceEntity;
  order: number;
  caption: string;
}

export type SectionsState = {
  entities: EntitiesMap<SectionEntity>;
}

const namespace = 'sections';
const sectionApi = new Api(namespace);

const actions = createActionCreators({
  ...createBaseEntityActions<SectionEntity>(),
  create: (parent: WorkspaceEntity) => ({ parent }),
  add: (entity: SectionEntity) => ({ entity }),
  move: (id: ID, destination: { parent?: WorkspaceEntity; position?: number }) => ({ id, destination }),
}, namespace);

const spec: ModelSpec<SectionsState, typeof actions> = {
  namespace,
  state: {
    entities: Map<ID, SectionEntity>(),
    // ui: {},
  },
  actions,
  reducers: {
    entities: createBaseEntityReducers<SectionEntity>(),
  },
  effects: {
    ...createBaseEntityEffects<SectionEntity>(namespace, actions),
    create: function* ({ parent }) {
      const siblings = yield select((state: ModelsState) => state.sections.entities.filter(s => isWorkspacesEqual(parent, s.parent)));

      const entityToAdd = {
        parent,
        caption: '',
        order: getNextOrder(List(siblings)),
      };

      const entity = yield call(sectionApi.add, entityToAdd);
      yield put(actions.add(entity));
    },
    // TODO обобщить с таск моделью
    move: function* ({ id, destination: actionDestination }) {
      const section: SectionEntity = yield select(state => sectionSelector(state, id));

      const destination = {
        parent: isUndefined(actionDestination.parent) ? section.parent : actionDestination.parent,
        position: actionDestination.position,
      };

      const state: ModelsState = yield select();
      const targetSiblings: EntitiesMap<SectionEntity> = state.sections.entities.filter(s => isWorkspacesEqual(s.parent, section.parent));

      if (actionDestination.position == null) {
        //
      } else {
        let siblingsList = targetSiblings.sortBy(section => section.order).toList();
        const sourceIndex = siblingsList.findIndex(section => section.id === id);

        if (sourceIndex !== -1) {
          siblingsList = siblingsList.delete(sourceIndex);
        }

        siblingsList = siblingsList.insert(actionDestination.position, section);
        const ids = siblingsList.map(task => task.id).toArray();
        const fieldsMap = makeOrderFieldsMap(ids, 'order');

        // TODO [opt] update only changed entities
        yield put(actions.batchUpdate(fieldsMap));
        yield put(actions.update(id, { parent: destination.parent }));
      }
    },
  },
};

export {
  namespace as sectionsNamespace,
  actions as sectionActions,
};

export default spec;



