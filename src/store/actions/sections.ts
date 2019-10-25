export const SECTIONS_CREATE = 'sections/create';
export const SECTIONS_ADD = 'sections/add';
export const SECTIONS_UPDATE = 'sections/update';
export const SECTIONS_REMOVE = 'sections/remove';
export const SECTIONS_LOAD = 'sections/load';
export const SECTIONS_RECEIVE = 'sections/receive';

export function create(parentId) {
  return {
    parentId,
    type: SECTIONS_CREATE,
  };
}

export function add(fields) {
  return {
    type: SECTIONS_ADD,
    fields,
  };
}

export function load() {
  return {
    type: SECTIONS_LOAD,
  };
}

export function receive(sections) {
  return {
    type: SECTIONS_RECEIVE,
    sections,
  };
}

export function update(id, fields) {
  return {
    type: SECTIONS_UPDATE,
    id,
    fields,
  };
}

export function remove(id) {
  return {
    type: SECTIONS_REMOVE,
    id,
  };
}
