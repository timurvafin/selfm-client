/* eslint-disable arrow-body-style */
import * as ajax from '../common/utils/ajax';


export default class Api {
  entityNamespace: string;
  baseUrl = `${location.protocol}//${location.hostname}:9000`;
  
  constructor(entityNamespace) {
    this.entityNamespace = entityNamespace;
  }

  makeUrl(action) {
    return `${this.baseUrl}/${this.entityNamespace}/${action}`;
  }

  list = (type?: string) => {
    if (type) {
      return ajax.post(this.makeUrl('list'), { type });
    }

    return ajax.get(this.makeUrl('list'));
  }

  update = (id, fields) => {
    return ajax.post(this.makeUrl('update'), { id, fields });
  }

  batchUpdate = (entities) => {
    return ajax.post(this.makeUrl('batchUpdate'), entities);
  }

  add = (fields) => {
    return ajax.post(this.makeUrl('add'), fields);
  }

  reorder = (ids) => {
    return ajax.post(this.makeUrl('reorder'), ids);
  }

  remove = (id) => {
    return ajax.post(this.makeUrl('remove'), { id });
  }
}