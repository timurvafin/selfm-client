import * as ajax from 'src/utils/ajax'
import {receive as receiveTasks, open as openTask} from './tasks'

export const RECEIVE_PROJECTS = 'projects:receive';
export const SELECT_PROJECT   = 'projects:select';
export const OPEN_PROJECT     = 'projects:open';
export const UPDATE_PROJECT   = 'projects:update';
export const CREATE_PROJECT   = 'projects:create';

export function load() {
    return async dispatch => {
        const projects = await ajax.get('tm/load-projects')

        dispatch(receive(projects))
        dispatch(open(1))
    }
}

export function open(id) {
    return async dispatch => {
        dispatch(_open(id))

        const tasks = await ajax.get('tm/load-tasks', {parent_id: id})

        dispatch(receiveTasks(tasks))
        dispatch(openTask(2))
    };
}

export function update(id, fields) {
    return async dispatch => {
        dispatch(_update(id, fields))

        const project = await ajax.post('tm/update-project', {id, fields})

        dispatch(_update(id, project))
    };
}

export function create() {
    return {
        type: CREATE_PROJECT,
    };
}

export function receive(projects) {
    return {
        type: RECEIVE_PROJECTS,
        projects,
    };
}

export function _open(id) {
    return {
        type: OPEN_PROJECT,
        id
    };
}

export function _update(id, fields) {
    return {
        type: UPDATE_PROJECT,
        id,
        fields
    };
}
