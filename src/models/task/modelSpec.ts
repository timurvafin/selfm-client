/* eslint-disable arrow-body-style */
import { call, put, select } from '@redux-saga/core/effects';
import { Shortcut, WorkspaceTypes } from 'common/constants';
import { ID } from 'common/types';
import { isUndefined, randomString } from 'common/utils/common';
import { Map } from 'immutable';
import Api from 'service/api';
import {
  createActionCreators,
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
  create: (workspace?: WorkspaceEntity, fields?: Partial<TaskEntity>) => ({ workspace, fields: fields || {}, open }),
  createAndOpen: (workspace?: WorkspaceEntity, fields?: Partial<TaskEntity>) => ({ workspace, fields: fields || {}, open }),
  move: (id: ID, destination: { parentId?: ID; sectionId?: ID; position?: number }) => ({ id, destination }),
  reorder: (ids: Array<ID>, orderBy: string) => ({ ids, orderBy }),
  setShortcut: (taskId: ID, shortcutCode: Shortcut) => ({ taskId, shortcutCode }),
  updateCaption: (id: ID, caption: string) => ({ id, caption }),
  // todos
  createTodo: (parentId: ID, position?: number) => ({ parentId, position }),
  updateTodo: (parentId, uid: ID, fields: Partial<TodoEntity>) => ({ parentId, uid, fields }),
  removeTodo: (parentId, uid: ID) => ({ parentId, uid }),
}, namespace);

const isSmartCaption = caption => caption.includes(' // ');

const extractFieldsFromCaption = (caption) => {
  const [cleanCaption, stringToParse] = caption.split(' // ');
  let fields = { caption: cleanCaption };

  if (stringToParse) {
    const extractedValues = extractFieldsValuesFromStr(stringToParse);
    fields = { ...fields, ...extractedValues };
  }

  return fields;
};

const createEffect = function* ({ workspace, fields }) {
  const state: ModelsState = yield select();
  const siblings: EntitiesMap<TaskEntity> = selectors.siblings(state, workspace, fields.parentId, fields.sectionId);

  if (fields.caption && isSmartCaption(fields.caption)) {
    const extractedValues = extractFieldsFromCaption(fields.caption);
    const values = mergeCollectionFieldValues(extractedValues, fields);
    fields = { ...fields, ...values };
  }

  const entityToAdd = {
    ...getEntityFieldsByWorkspace(workspace),
    caption: '',
    completed: false,
    tags: [],
    order: getNextOrder(siblings.toList(), 'order'),
    order2: getNextOrder(siblings.toList(), 'order2'),
    todoList: [],
    ...fields,
  };

  const entity: TaskEntity = yield call(taskApi.add, entityToAdd);
  yield put(actions.add(entity));

  return entity.id;
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
    },
    ui: {},
  },
  effects: {
    ...createBaseEntityEffects<TaskEntity>(namespace, actions),
    updateCaption: function* ({ id, caption }) {
      if (!caption) {
        return yield put(actions.update(id, { caption: '' }));
      }

      let fieldsToUpdate;
      if (isSmartCaption(caption)) {
        const task: TaskEntity = yield select(state => selectors.byId(state, id));
        const extractedValues = extractFieldsFromCaption(caption);
        const values = mergeCollectionFieldValues(extractedValues, task);
        fieldsToUpdate = { ...extractedValues, ...values };
      } else {
        fieldsToUpdate = { caption };
      }

      yield put(actions.update(id, fieldsToUpdate));
    },
    create: createEffect,
    createAndOpen: function* ({ workspace, fields }) {
      const id = yield* createEffect({ workspace, fields });

      if (open) {
        yield put(workspaceActions.setTaskOpen(id, true));
      }
    },
    createTodo: function* ({ parentId, position }) {
      const task: TaskEntity = yield select(state => selectors.byId(state, parentId));
      const todoList = [...task.todoList];

      const newTodo = {
        id: null,
        uid: randomString(),
        caption: '',
        completed: false,
      };

      if (!isUndefined(position)) {
        todoList.splice(position, 0, newTodo);
      } else {
        todoList.push(newTodo);
      }

      yield put(actions.update(parentId, { todoList }));
    },
    updateTodo: function* ({ parentId, uid, fields }) {
      const task: TaskEntity = yield select(state => selectors.byId(state, parentId));
      const todoList = (task.todoList || []).map(todo => todo.uid === uid ? { ...todo, ...fields } : todo);

      yield put(actions.update(parentId, { todoList }));
    },
    removeTodo: function* ({ parentId, uid }) {
      const task: TaskEntity = yield select(state => selectors.byId(state, parentId));
      const todoList = (task.todoList || []).filter(todo => todo.uid !== uid);
      yield put(actions.update(parentId, { todoList }));
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



