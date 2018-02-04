import * as ajax from '../utils/ajax'

const baseUrl = `${location.protocol}//${location.hostname}:3000/`

export function makeUrl(action) {
    return baseUrl + action
}

export function loadProjects() {
    return ajax.get(makeUrl('tm/load-projects'))
}

export function loadTasks(parentId) {
    return ajax.get(makeUrl('tm/load-tasks'), {parent_id: parentId})
}

export function loadTodos(parentId) {
    return ajax.get(makeUrl('tm/load-tasks'), {parent_id: parentId})
}

export function update(id, fields) {
    return ajax.post(makeUrl('tm/update'), {id, fields})
} 

export function add(fields) {
    return ajax.post(makeUrl('tm/add'), fields)
}

export function remove(id) {
    return ajax.post(makeUrl('tm/remove'), id)
}