export const TODOS_CREATE  = 'todos/create'
export const TODOS_ADD     = 'todos/add'
export const TODOS_REMOVE  = 'todos/remove'
export const TODOS_UPDATE  = 'todos/update'
export const TODOS_TOGGLE  = 'todos/toggle'
export const TODOS_RECEIVE = 'todos/receive'

export function create(parentId) {
    return {
        type: TODOS_CREATE,
        parentId
    }
}

export function add(fields) {
    return {
        type: TODOS_ADD,
        fields
    }
}

export function receive(payload) {
    return {
        type: TODOS_RECEIVE,
        payload
    }
}

export function update(id, fields) {
    return {
        type: TODOS_UPDATE,
        id,
        fields
    }
}

export function toggle(id, complete) {
    return {
        type: TODOS_TOGGLE,
        id,
        complete
    }
}

export function remove(id) {
    return {
        type: TODOS_REMOVE,
        id
    }
}