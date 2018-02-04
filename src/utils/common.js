export function updateInArray(items, field, fieldValue, fields, doMerge = true) {
    return items.map(item => {
        if (item[field] !== fieldValue) {
            return item
        }

        if (typeof fields === 'function') {
            fields = fields(item)
        }

        return doMerge ? merge(item, fields) : fields
    })
}

export function updateItems(items, cb, doMerge = true) {
    return items.map(item => doMerge ? merge(item, cb(item)) : cb(item))
}

export const updateById = (items, id, fields, doMerge = true) => {
    return updateInArray(items, 'id', id, fields, doMerge)
}

export function findInArray(items, fieldName, fieldValue) {
    for (var i = 0; i < items.length; i++) {
        if (items[i][fieldName] === fieldValue) {
            return items[i][fieldName]
        }
    }

    return null
}

export function onEnterKeyDown(e, cb) {

}

export function randomString() {
    return Math.random().toString(36).slice(2)
}

export function merge(...objects) {
    return Object.assign({}, ...objects)
}

export const ENTER_KEY = 13