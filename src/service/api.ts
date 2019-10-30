import * as ajax from '../common/utils/ajax';
import { ID } from '../common/types';


const baseUrl = `${location.protocol}//${location.hostname}:3000/`;

export function makeUrl(action) {
  return baseUrl + action;
}

export function list(type?: string) {
  if (type) {
    return ajax.post(makeUrl('tm/list'), { type });
  }

  return ajax.get(makeUrl('tm/list'));
}

export function update(id, fields) {
  return ajax.post(makeUrl('tm/update'), { id, fields });
}

export function add(fields, type) {
  return ajax.post(makeUrl('tm/add'), { ...fields, type });
}

export function reorder(ids) {
  return ajax.post(makeUrl('tm/reorder'), ids);
}

export function remove(id) {
  return ajax.post(makeUrl('tm/remove'), id);
}

export function loadSections(parentId?: ID) {
  return ajax.post(makeUrl('sections/list'), { parentId });
}

export function updateSection(id, fields) {
  return ajax.post(makeUrl('sections/update'), { id, fields });
}

export function addSection(fields) {
  return ajax.post(makeUrl('sections/add'), fields);
}

export function reorderSections(ids) {
  return ajax.post(makeUrl('sections/reorder'), ids);
}

export function removeSection(id) {
  return ajax.post(makeUrl('sections/remove'), id);
}