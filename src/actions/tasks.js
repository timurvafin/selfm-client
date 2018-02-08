export const TASKS_LOAD     = 'tasks/load'
export const TASKS_RECEIVE  = 'tasks/receive'
export const TASKS_CREATE   = 'tasks/create'
export const TASKS_ADD      = 'tasks/add'
export const TASKS_UPDATE   = 'tasks/update'
export const TASKS_TOGGLE   = 'tasks/toggle'
export const TASKS_REMOVE   = 'tasks/remove'
export const TASKS_REORDER  = 'tasks/reorder'
export const TASKS_SELECT   = 'tasks/select'
export const TASKS_SET_OPEN = 'tasks/open'

export const TASKS_LOADED = 'tasks/loaded'


export function loaded(payload) {
    return {
        type: TASKS_LOADED,
        payload
    }
} 

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

export function add(payload) {
    return {
        type: TASKS_ADD,
        payload,
    }
}

export function receive(payload) {
    return {
        type: TASKS_RECEIVE,
        payload,
    }
}

export function reorder(order) {
    return {
        type: TASKS_REORDER,
        order
    }
}

export function select(id, select = true) {
    return {
        type: TASKS_SELECT,
        id,
        select
    }
}

export function setOpen(id, open = true) {
    return {
        type: TASKS_SET_OPEN,
        id,
        open
    }
}