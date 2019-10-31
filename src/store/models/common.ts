/* eslint-disable arrow-body-style */
import { Map, List, getIn } from 'immutable';
import { call, select, takeEvery } from '@redux-saga/core/effects';
import { ID } from '../../common/types';
import { randomString } from '../../common/utils/common';
import { ModelsState } from './index';
import { TaskEntity } from './task';


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
  isNew?: boolean;
}

export interface BaseTaskEntity extends BaseEntity, Completable {
  sectionId?: ID;
  // type: 'project' | 'task';
  startTime?: number;
  startTimeTag?: string;
  notes?: string;
  caption: string;
  order: number;
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

export const entityBaseReducers = {
  add: (state: EntitiesMap<any>, { entity }) => {
    return state.set(entity.id, entity);
  },
  receive: (state: EntitiesMap<any>, { entities }) => {
    const entitiesEntries: Array<[ID, any]> = entities.map(entity => [entity.id, entity]);
    return state.merge(entitiesEntries);
  },
  update: (state: EntitiesMap<any>, { id, fields }) => {
    return state.mergeIn([id], fields);
  },
  remove: (state: EntitiesMap<any>, { id }) => {
    return state.delete(id);
  },
};

export const createUpdateEffect = ({
  namespace,
  addApi,
  updateApi,
  updateAction,
}) => function* (action) {
  const { id, fields } = action;
  const state: ModelsState = yield select();
  const entity = state[namespace].entities.get(id);

  if (!entity) {
    return;
  }

  yield call(updateApi, id, fields);
  /*if (entity.isNew) {
    yield call(addApi, { ...entity, ...fields });
    yield put(updateAction(id, { isNew: false }));
  } else {
    yield call(updateApi, id, fields);
  }*/
};

/**
 * Обновляет значения порядковых номеров у сущностей на основе отсортированного массива.
 * Используется для DnD перемещения
 */
export const updateEntitiesOrder = (entities: EntitiesMap<any>, ids: Array<ID>) => {
  return ids.reduce((nextState: EntitiesMap<TaskEntity>, id, order) => {
    return nextState.setIn([id, 'order'], order);
  }, entities);
};

export const getNextOrder = (entities: List<BaseTaskEntity>) => {
  const entityWithMaxOrder = entities.maxBy(entity => entity.order);

  return entityWithMaxOrder ? (entityWithMaxOrder.order + 1) : 1;
};


