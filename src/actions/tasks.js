export const TASKS_LOAD    = 'tasks/load'
export const TASKS_RECEIVE = 'tasks/receive'
export const TASKS_CREATE  = 'tasks/create'
export const TASKS_ADD     = 'tasks/add'
export const TASKS_UPDATE  = 'tasks/update'
export const TASKS_TOGGLE  = 'tasks/toggle'
export const TASKS_REMOVE  = 'tasks/remove'
export const TASKS_REORDER = 'tasks/reorder'
export const TASKS_SELECT  = 'tasks/select'
export const TASKS_OPEN    = 'tasks/open'

export function create(parentId) {
    return {
        type: TASKS_CREATE,
        parentId,
    }
}

export function update(id, fields) {
    return {
        type: TASKS_UPDATE,
        id,
        fields,
    }
}

export function toggle(id, complete) {
    return {
        type: TASKS_TOGGLE,
        id,
        complete
    }
}

/*export function updateSucceeded(id, task) {
    return {
        type: UPDATE_SUCCEEDED,
        id,
        task
    }
}

export function updateFailed(id, error) {
    return {
        type: UPDATE_FAILED,
        error
    }
}*/

export function remove(id) {
    return {
        type: TASKS_REMOVE,
        id,
    }
}

export function load() {
    return {
        type: TASKS_LOAD
    }
}

export function add(fields) {
    return {
        type: TASKS_ADD,
        fields,
    }
}

export function receive(tasks) {
    return {
        type: TASKS_RECEIVE,
        tasks,
    }
}

export function reorder(ids) {
    return {
        type: TASKS_REORDER,
        ids
    }
}

export function select(id, select = true) {
    return {
        type: TASKS_SELECT,
        id,
        select
    }
}

export function open(id) {
    return {
        type: TASKS_OPEN,
        id
    }
}