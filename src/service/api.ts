/* eslint-disable arrow-body-style */
import * as ajax from '../common/utils/ajax';


export default class Api {
  entity: string;
  baseUrl = `${location.protocol}//${location.hostname}:9000`;
  
  constructor(entity) {
    this.entity = entity;
  }

  makeUrl(action) {
    return `${this.baseUrl}/${this.entity}/${action}`;
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