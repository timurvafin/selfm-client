/* eslint-disable arrow-body-style */
import { Map, List, getIn } from 'immutable';
import { call, put, select, takeEvery } from '@redux-saga/core/effects';
import { ID } from '../common/types';
import { randomString } from '../common/utils/common';
import { ModelsState } from './index';
import { TaskEntity } from './task';
import Api from '../service/api';


/**
 * TODO [rfg] Почистить типы ActionCreator/ActionCreatorSpec
 * TODO [rfg] Распределить код по разным местам
 */
export type ActionCreatorSpec = (...args) => {};
export type ActionObject<T extends ActionCreatorSpec | undefined> = { type: string } & ReturnType<T>;
export type ActionCreator<T extends ActionCreatorSpec> = (...args: Parameters<T>) => ActionObject<T>;

export interface BaseActionCreatorSpecs {
  [name: string]: ActionCreatorSpec;
}

export type ActionCreators<T extends BaseActionCreatorSpecs> = {
  [K in keyof T]: ActionCreator<T[K]>;
}

type ActionReducers<State, T extends BaseActionCreatorSpecs> = Partial<{
  [K in keyof T]: (state: State, action: ActionObject<T[K]>) => State;
}>

type Subreducers<State, T extends BaseActionCreatorSpecs> = {
  [K in keyof State]: ActionReducers<State[K], T>
}

export type Reducers<State, T extends BaseActionCreatorSpecs> = ActionReducers<State, T> | Subreducers<State, T>

export type Effects<T extends BaseActionCreatorSpecs> = Partial<{
  [K in keyof T]: (action: ActionObject<T[K]>) => IterableIterator<any>;
}>

export interface ModelSpec<State, T extends BaseActionCreatorSpecs> {
  namespace: string;
  state: State;
  actions: T;
  reducers?: Reducers<State, T>;
  effects?: Effects<T>;
  selectors?: any;
  opts?: {
    delimeter?: string;
  };
}

export interface BaseEntity {
  id: ID;
  parentId?: ID;
  order?: number;
  isNew?: boolean;
}

export interface BaseTaskEntity extends BaseEntity, Completable {
  sectionId?: ID;
  // type: 'project' | 'task';
  startTime?: number;
  startTimeTag?: string;
  notes?: string;
  caption: string;
}

export interface Completable {
  completed: boolean;
}

export type EntitiesMap<T extends BaseEntity> = Map<ID, T>;

export type EntitiesArray<T extends BaseEntity> = Array<T>;

export const createActionCreators = <T extends BaseActionCreatorSpecs>(actionSpecs: T, namespace): ActionCreators<T> => {
  const actionsMap = Map(actionSpecs);

  // @ts-ignore
  return actionsMap.map((creator, name) => (...args) => ({
    ...creator(...args),
    type: `${namespace}/${name}`,
  })).toObject();
};


export class Model<State, ActionCreators> {
  public namespace: string;

  namespacePrefix: string;
  spec: ModelSpec<State, BaseActionCreatorSpecs>;
  opts = {
    delimeter: '/',
  };

  constructor(spec: ModelSpec<State, BaseActionCreatorSpecs>) {
    this.spec = spec;

    if (spec.opts) {
      this.opts = { ...this.opts, ...spec.opts };
    }

    this.namespace = spec.namespace;
    this.namespacePrefix = `${spec.namespace}${this.opts.delimeter}`;
  }

  // TODO [impl] implement common abstract algorithm
  reduce(state: State = this.spec.state, action: ActionObject<any>) {
    const actionName = this.toActionName(action.type);
    if (!actionName) {
      return state;
    }

    // @ts-ignore
    const keys = Reflect.ownKeys(state);

    return keys.reduce((nextState, key) => {
      const concreteReducer = getIn(this.spec, ['reducers', key, actionName], null);
      if (concreteReducer) {
        nextState[key] = concreteReducer(nextState[key], action);
      }

      return nextState;
    }, { ...state });
  }

  *saga() {
    const effects = this.spec.effects;

    for (const actionName in effects) {
      yield takeEvery(this.toActionType(actionName), effects[actionName]);
    }
  }

  toActionName(actionType) {
    if (actionType.indexOf(this.namespacePrefix) !== 0) {
      return null;
    }

    return actionType.replace(this.namespacePrefix, '');
  }

  toActionType(actionName) {
    return `${this.namespacePrefix}${actionName}`;
  }
}

export const createBaseEntity = () => {
  const tempId = randomString();

  return {
    id: tempId,
    isNew: true,
  };
};

/**
 * Обновляет значения порядковых номеров у сущностей на основе отсортированного массива.
 * Используется для DnD перемещения
 */
export const updateEntitiesOrder = <T>(entitiesState: EntitiesMap<any>, ids: Array<ID>) => {
  return ids.reduce((nextState: EntitiesMap<any>, id, order) => {
    return nextState.setIn([id, 'order'], order);
  }, entitiesState);
};

export const createBaseEntityActions = <T extends BaseEntity>() => ({
  add: (entity: T) => ({ entity }),
  update: (id: ID, fields: Partial<T>) => ({ id, fields }),
  remove: (id: ID) => ({ id }),
  load: () => ({}),
  reorder: (ids: Array<ID>) => ({ ids }),
  receive: (entities: EntitiesArray<T>) => ({ entities }),
});

export const createBaseEntityReducers = <T extends BaseEntity>() => ({
  add: (state: EntitiesMap<T>, { entity }) => {
    return state.set(entity.id, entity);
  },
  receive: (state: EntitiesMap<T>, { entities }) => {
    const entitiesEntries: Array<[ID, T]> = entities.map(entity => [entity.id, entity]);
    return state.merge(entitiesEntries);
  },
  update: (state: EntitiesMap<T>, { id, fields }) => {
    return state.mergeIn([id], fields);
  },
  remove: (state: EntitiesMap<T>, { id }) => {
    return state.delete(id);
  },
  reorder: (state: EntitiesMap<T>, action) => {
    return updateEntitiesOrder(state, action.ids);
  },
});

export const createBaseEntityEffects = <T extends BaseEntity>(namespace, actions) => {
  const api = new Api(namespace);

  return {
    load: function* () {
      const entities: EntitiesArray<T> = yield call(api.list);

      yield put(actions.receive(entities));
    },
    update: function* (action) {
      const { id, fields } = action;
      const state: ModelsState = yield select();
      const entity = state[namespace].entities.get(id);

      if (!entity) {
        return;
      }

      yield call(api.update, id, fields);
    },
    reorder: function* ({ ids }) {
      yield call(api.reorder, ids);
    },
    remove: function* ({ id }) {
      yield call(api.remove, id);
    },
  };
};

export const getNextOrder = (entities: List<BaseTaskEntity>) => {
  const entityWithMaxOrder = entities.maxBy(entity => entity.order);

  return entityWithMaxOrder ? (entityWithMaxOrder.order + 1) : 1;
};


