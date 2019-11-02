/* eslint-disable arrow-body-style */
import { Map } from 'immutable';
import {
  createActionCreators,
  createBaseEntity,
  EntitiesMap,
  createBaseEntityReducers,
  getNextOrder,
  ModelSpec, createBaseEntityEffects, createBaseEntityActions, makeOrderFieldsMap,
} from '../common';
import { ID } from 'common/types';
import { call, put, select } from '@redux-saga/core/effects';
import Api from 'service/api';
import { ModelsState } from '../index';
import { workspaceActions, WorkspaceEntity, workspaceSelectors } from '../workspace';
import { Shortcut, WorkspaceTypes } from 'common/constants';
import { isUndefined } from 'common/utils/common';
import { TaskEntity, TasksState, TodoEntity } from './index';
import * as selectors from './selectors';


const namespace = 'tasks';
const taskApi = new Api(namespace);

const actions = createActionCreators({
  ...createBaseEntityActions<TaskEntity>(),
  create: (workspace?: WorkspaceEntity, sectionId?: ID) => ({ workspace, sectionId }),
  move: (id: ID, destination: { parentId?: ID; sectionId?: ID; position?: number }) => ({ id, destination }),
  setShortcut: (taskId: ID, shortcutCode: Shortcut) => ({ taskId, shortcutCode }),
  // todos
  createTodo: (parentId: ID) => ({ parentId }),
  addTodo: (entity: TodoEntity) => ({ entity }),
  updateTodo: (parentId, id: ID, fields: Partial<TodoEntity>) => ({ parentId, id, fields }),
  removeTodo: (parentId, id: ID) => ({ parentId, id }),
}, namespace);

const getEntityFields = (workspace: WorkspaceEntity) => {
  if (!workspace) {
    return {};
  }

  if (workspace.type === WorkspaceTypes.PROJECT) {
    return { parentId: workspace.code };
  }

  if (workspace.type === WorkspaceTypes.SHORTCUT) {
    const handlers = {
      [Shortcut.INBOX]: () => ({ startTime: null, startTimeTag: null, parentId: null, sectionId: null }),
      [Shortcut.TODAY]: () => ({ startTime: Date.now(), startTimeTag: null }),
      [Shortcut.PLANS]: () => ({ startTime: Date.now() + 24 * 3600, startTimeTag: null }),
      [Shortcut.ANYTIME]: () => ({ startTimeTag: 'anytime', startTime: null }),
      [Shortcut.SOMEDAY]: () => ({ startTimeTag: 'someday', startTime: null }),
    };

    if (handlers[workspace.code]) {
      return handlers[workspace.code]();
    }
  }

  return {};
};

const modelSpec: ModelSpec<TasksState, typeof actions> = {
  namespace,
  state: {
    entities: Map<ID, TaskEntity>(),
    ui: {},
  },
  actions,
  reducers: {
    entities: {
      ...createBaseEntityReducers<TaskEntity>(),
      addTodo: (state: EntitiesMap<TaskEntity>, { entity }) => {
        return state.mergeIn([entity.id, 'todoList'], [entity]);
      },
      updateTodo: (state: EntitiesMap<TaskEntity>, { parentId, id, fields }) => {
        return state.mergeIn([parentId, 'todoList', id], fields);
      },
      removeTodo: (state: EntitiesMap<TaskEntity>, { parentId, id }) => {
        return state.deleteIn([parentId, 'todoList', id]);
      },
    },
    ui: {},
  },
  effects: {
    ...createBaseEntityEffects<TaskEntity>(namespace, actions),
    create: function* ({ workspace, sectionId }) {
      const state: ModelsState = yield select();
      const siblings: EntitiesMap<TaskEntity> = selectors.byWorkspace(state, workspace, sectionId);

      const entityToAdd = {
        ...getEntityFields(workspace),
        caption: '',
        sectionId,
        completed: false,
        tags: [],
        order: getNextOrder(siblings.toList()),
        todoList: [],
      };

      const entity: TaskEntity = yield call(taskApi.add, entityToAdd);
      yield put(actions.add(entity));
      yield put(workspaceActions.setTaskOpen(entity.id, true));
    },
    createTodo: function* ({ parentId }) {
      const baseEntity = createBaseEntity();

      yield put(actions.addTodo({
        ...baseEntity,
        caption: '',
        parentId,
        completed: false,
      }));
    },
    setShortcut: function* ({ taskId, shortcutCode }) {
      yield put(actions.update(taskId, getEntityFields({ code: shortcutCode, type: WorkspaceTypes.SHORTCUT })));
    },
    move: function* ({ id, destination: actionDestination }) {
      const task: TaskEntity = yield select(state => selectors.byId(state, id));
      const workspace: WorkspaceEntity = yield select(workspaceSelectors.selectedWorkspace);
      const orderBy = workspace.type === WorkspaceTypes.SHORTCUT ? 'order2' : 'order';

      const destination = {
        parentId: isUndefined(actionDestination.parentId) ? task.parentId : actionDestination.parentId,
        sectionId: isUndefined(actionDestination.sectionId) ? task.sectionId : actionDestination.sectionId,
        position: actionDestination.position,
      };

      const targetSiblings: EntitiesMap<TaskEntity> = yield select(state => selectors.siblings(state, workspace, destination.sectionId));

      // move
      if (actionDestination.position == null) {
        const order = getNextOrder(targetSiblings.toList(), orderBy);
        yield put(actions.update(id, { parentId: destination.parentId, sectionId: destination.sectionId, order }));
      } else {
        let orderedSiblings = targetSiblings.sortBy(task => task[orderBy]).toList();
        const sourceIndex = orderedSiblings.findIndex(task => task.id === id);

        if (sourceIndex !== -1) {
          orderedSiblings = orderedSiblings.delete(sourceIndex);
        }

        orderedSiblings = orderedSiblings.insert(actionDestination.position, task);
        const ids = orderedSiblings.map(task => task.id).toArray();

        const fieldsMap = makeOrderFieldsMap(ids, orderBy);
        // TODO [opt] update only changed entities
        yield put(actions.batchUpdate(fieldsMap));

        const isParentChanged = actionDestination.parentId && task.parentId !== actionDestination.parentId;
        const isSectionChanged = actionDestination.sectionId && task.sectionId !== actionDestination.sectionId;

        if (isParentChanged || isSectionChanged) {
          yield put(actions.update(id, { parentId: destination.parentId, sectionId: destination.sectionId }));
        }
      }
    },
  },
};

export {
  namespace,
  actions,
};

export default modelSpec;



