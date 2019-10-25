export const PROJECTS_CREATE = 'projects/create';
export const PROJECTS_ADD = 'projects/add';
export const PROJECTS_UPDATE = 'projects/update';
export const PROJECTS_TOGGLE = 'projects/toggle';
export const PROJECTS_REMOVE = 'projects/remove';
export const PROJECTS_OPEN = 'projects/open';
export const PROJECTS_LOAD = 'projects/load';
export const PROJECTS_LOADED = 'projects/loaded';
export const PROJECTS_RECEIVE = 'projects/receive';
export const PROJECTS_SELECT_TAG = 'projects/select-tag';

export function create() {
  return {
    type: PROJECTS_CREATE,
  };
}

export function add(fields) {
  return {
    type: PROJECTS_ADD,
    fields,
  };
}

export function load() {
  return {
    type: PROJECTS_LOAD,
  };
}

export function receive(projects) {
  return {
    type: PROJECTS_RECEIVE,
    projects,
  };
}

export function open(id) {
  return {
    type: PROJECTS_OPEN,
    id,
  };
}

export function update(id, fields) {
  return {
    type: PROJECTS_UPDATE,
    id,
    fields,
  };
}

export function toggle(id, complete) {
  return {
    type: PROJECTS_TOGGLE,
    id,
    complete,
  };
}

export function remove(id) {
  return {
    type: PROJECTS_REMOVE,
    id,
  };
}

export const selectTag = (tag) => ({ type: PROJECTS_SELECT_TAG, tag });
