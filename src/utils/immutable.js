import { OrderedMap, fromJS } from 'immutable'

export function updateListItem(items, field, fieldValue, fields, mergeFields = true) {
    return map(items, prevFields => {
        if (prevFields.get(field) !== fieldValue) {
            return prevFields
        }

        return fields
    }, mergeFields)
}

export const updateListItemById = (items, id, fields, mergeFields = true) => {
    return updateListItem(items, 'id', id, fields, mergeFields)
}

export function map(collection, updater, mergeFields = true) {
    const _updater = typeof updater === 'function' ? updater : () => updater

    return collection.map(item => mergeFields ? item.merge(_updater(item)) : _updater(item))
}

export function toOrderedMap(jsArray, field) {
    return jsArray.reduce((map, v) => map.set(v[field], fromJS(v)), OrderedMap())
}

/*
 export function findInArray(items, fieldName, fieldValue) {
 for (var i = 0 i < items.length
 i++
 )
 {
 if (items[i][fieldName] === fieldValue) {
 return items[i][fieldName]
 }
 }

 return null
 }

 export function merge(...objects) {
 return Object.assign({}, ...objects)
 }*/
