/* eslint-disable arrow-body-style */
import { call, put, select } from '@redux-saga/core/effects';
import { Shortcut, WorkspaceTypes } from 'common/constants';
import { ID } from 'common/types';
import { isUndefined } from 'common/utils/common';
import { Map } from 'immutable';
import Api from 'service/api';
import {
  createActionCreators,
  createBaseEntity,
  createBaseEntityActions,
  createBaseEntityEffects,
  createBaseEntityReducers,
  EntitiesMap,
  getNextOrder,
  makeOrderFieldsMap,
  ModelSpec,
} from '../common';
import { ModelsState } from '../index';
import { workspaceActions, WorkspaceEntity, workspaceSelectors } from '../workspace';
import { TaskEntity, TasksState, TodoEntity } from './index';
import * as selectors from './selectors';
import { extractFieldsValuesFromStr, getEntityFieldsByWorkspace, mergeCollectionFieldValues } from './utils';


const namespace = 'tasks';
const taskApi = new Api(namespace);

const actions = createActionCreators({
  ...createBaseEntityActions<TaskEntity>(),
  create: (workspace?: WorkspaceEntity, sectionId?: ID) => ({ workspace, sectionId }),
  move: (id: ID, destination: { parentId?: ID; sectionId?: ID; position?: number }) => ({ id, destination }),
  reorder: (ids: Array<ID>, orderBy: string) => ({ ids, orderBy }),
  setShortcut: (taskId: ID, shortcutCode: Shortcut) => ({ taskId, shortcutCode }),
  updateCaption: (id: ID, caption: string) => ({ id, caption }),
  // todos
  createTodo: (parentId: ID) => ({ parentId }),
  addTodo: (entity: TodoEntity) => ({ entity }),
  updateTodo: (parentId, id: ID, fields: Partial<TodoEntity>) => ({ parentId, id, fields }),
  removeTodo: (parentId, id: ID) => ({ parentId, id }),
}, namespace);

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
    updateCaption: function* ({ id, caption }) {
      if (!caption) {
        yield put(actions.update(id, { caption: '' }));
      }

      const [cleanCaption, stringToParse] = caption.split(' // ');
      let fieldsToUpdate = { caption: cleanCaption };

      if (stringToParse) {
        const task: TaskEntity = yield select(state => selectors.byId(state, id));
        const extractedValues = extractFieldsValuesFromStr(stringToParse);
        const values = mergeCollectionFieldValues(extractedValues, task);
        fieldsToUpdate = { ...fieldsToUpdate, ...values };
      }

      yield put(actions.update(id, fieldsToUpdate));
    },
    create: function* ({ workspace, sectionId }) {
      const state: ModelsState = yield select();
      const siblings: EntitiesMap<TaskEntity> = selectors.byWorkspace(state, workspace, sectionId);

      const entityToAdd = {
        ...getEntityFieldsByWorkspace(workspace),
        caption: '',
        sectionId,
        completed: false,
        tags: [],
        order: getNextOrder(siblings.toList(), 'order'),
        order2: getNextOrder(siblings.toList(), 'order2'),
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
      yield put(actions.update(taskId, getEntityFieldsByWorkspace({
        code: shortcutCode,
        type: WorkspaceTypes.SHORTCUT,
      })));
    },
    reorder: function* ({ ids, orderBy }) {
      const fieldsMap = makeOrderFieldsMap(ids, orderBy);
      // TODO [opt] update only changed entities
      yield put(actions.batchUpdate(fieldsMap));
    },
    move: function* ({ id, destination: actionDestination }) {
      const task: TaskEntity = yield select(state => selectors.byId(state, id));
      const workspace: WorkspaceEntity = yield select(workspaceSelectors.selectedWorkspace);
      const orderBy = workspace.type === WorkspaceTypes.SHORTCUT ? 'order2' : 'order';

      const parentId = isUndefined(actionDestination.parentId) ? task.parentId : actionDestination.parentId;
      let sectionId;

      if (isUndefined(actionDestination.sectionId)) {
        sectionId = isUndefined(actionDestination.parentId) ? task.sectionId : null;
      } else {
        sectionId = actionDestination.sectionId;
      }

      const targetSiblings: EntitiesMap<TaskEntity> = yield select(state => selectors.siblings(state, workspace, sectionId));
      const order = getNextOrder(targetSiblings.toList(), orderBy);
      yield put(actions.update(id, { parentId, sectionId, [orderBy]: order }));
    },
  },
};

export {
  namespace,
  actions,
};

export default modelSpec;



