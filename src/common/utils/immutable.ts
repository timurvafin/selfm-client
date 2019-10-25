import { OrderedMap, fromJS } from 'immutable';


export function updateCollection(collection, updater, mergeFields = true) {
  const _updater = typeof updater === 'function' ? updater : () => updater;
  
  return collection.map(item => mergeFields ? item.merge(_updater(item)) : _updater(item));
}

export function updateListItem(items, field, fieldValue, fields, mergeFields = true) {
  return updateCollection(items, prevFields => {
    if (prevFields.get(field) !== fieldValue) {
      return prevFields;
    }

    return fields;
  }, mergeFields);
}

export const updateListItemById = (items, id, fields, mergeFields = true) => updateListItem(items, 'id', id, fields, mergeFields);

export function toOrderedMap(jsArray, field) {
  return jsArray.reduce((map, v) => map.set(v[field], fromJS(v)), OrderedMap());
}
