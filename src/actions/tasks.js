import * as ajax from 'src/utils/ajax'
import {randomString} from 'src/utils/common'

export const RECEIVE_TASKS = 'tasks:receive';
export const ADD_TASK      = 'tasks:add';
export const UPDATE_TASK   = 'tasks:update';
export const REMOVE_TASK   = 'tasks:remove';
export const TOGGLE_TASK   = 'tasks:toggle';
export const REORDER_TASKS = 'tasks:reorder';
export const SET_EDITABLE  = 'tasks:set-editable';
export const SELECT_TASK  = 'tasks:select';
export const OPEN_TASK  = 'tasks:open';
export const CREATE_TODO = 'tasks:create-todo'

export function load(parent_id) {
    return async dispatch => {
        const items = await ajax.get('tm/load', {parent_id})

        dispatch(receive(items))
    }
}

export function create(text) {
    return async dispatch => {
        const fields = makeFields(text);

        dispatch(_add(fields))

        const task = await ajax.post('tm/add', fields);
        dispatch(_update(task));
    };
}

export function update(id, fields) {
    return async dispatch => {
        dispatch(_update(id, fields))

        const task = await ajax.post('tm/update', {id, fields});

        dispatch(_update(id, task))
    };
}

export function remove(id) {
    return dispatch => {
        ajax.post('tm/remove', id);

        dispatch(_remove(id))
    };
}

function _add(fields) {
    return {
        type: ADD_TASK,
        fields,
    };
}

function _update(id, fields) {
    return {
        type: UPDATE_TASK,
        id,
        fields,
    };
}

function _remove(id) {
    return {
        type: REMOVE_TASK,
        id,
    };
}

export function receive(tasks) {
    return {
        type: RECEIVE_TASKS,
        tasks,
    };
}

export function reorder(ids) {
    return {
        type: REORDER_TASKS,
        ids
    };
}

export function select(id, select = true) {
    return {
        type: SELECT_TASK,
        id,
        select
    };
}

export function open(id) {
    return {
        type: OPEN_TASK,
        id
    };
}

export function createTodo(parentId) {
    return {
        type: CREATE_TODO,
        parentId
    };
}

function makeFields(text) {
    return {
        caption: text,
        tempId: randomString()
    };
}