export type ObjectMap<T> = {
  [key: string]: T;
}

export type Collection<T> = ObjectMap<T> | Array<T>;

const castPath = (path: string | Array<string>) => Array.isArray(path) ? path: [path];

const clone = <T>(collection: Collection<T>) => Array.isArray(collection) ? [...collection] : { ...collection };

// @ts-ignore
const merge = <T>(...collections: Array<Collection<T>>) => collections.reduce((res, collection) => Array.isArray(res) ? res.concat(collection) : { ...res, ...collection });

const updatePath = <T>(objectMap: ObjectMap<any>, path: Array<string>, updater: (value: T) => T) => {
  if (path.length <= 0) {
    // @ts-ignore
    return updater(objectMap);
  }

  const result = clone(objectMap);
  let prev = result;

  for (let i = 0; i < path.length; i++) {
    const pathItem = path[i];
    const isLast = i === path.length - 1;

    if (isLast) {
      prev[pathItem] = updater(prev[pathItem]);
    } else {
      prev[pathItem] = clone(prev[pathItem]);
      prev = prev[pathItem];
    }
  }

  return result;
};

export const filter = <T>(objectMap: ObjectMap<T>, predicate: (value: T, key: string) => boolean) => {
  const keys = Reflect.ownKeys(objectMap);

  return keys.filter((key: string) => predicate(objectMap[key], key)).reduce((result, key) => {
    result[key] = objectMap.key;
    return result;
  }, {});
};

export const updateIn = <T>(objectMap: ObjectMap<any>, path: Array<string> | string, updater: (value: T) => T) => {
  const pathArray = castPath(path);
  return updatePath(objectMap, pathArray, updater);
};

export const setIn = <T>(objectMap: ObjectMap<any>, path: Array<string> | string, value: T) => {
  const pathArray = castPath(path);
  const updater = () => value;
  return updatePath(objectMap, pathArray, updater);
};

export const mergeIn = <T extends Collection<any>>(objectMap: ObjectMap<any>, path: Array<string> | string, value: T) => {
  const pathArray = castPath(path);
  return updatePath(objectMap, pathArray, (val: T) => merge(val, value));
};

export const removeIn = <T>(objectMap: ObjectMap<any>, path: Array<string>) => {
  const pathArray = castPath(path);
  return updatePath(objectMap, pathArray.slice(-1), (values: Collection<any>) => filter(values, (_, key) => key !== pathArray[pathArray.length - 1]));
};

export const mapObjectValues = <T, U>(object: { [key: string]: T }, mapper: (value: T, key: string) => U): { [K in keyof typeof object]: U } => {
  const keys = Reflect.ownKeys(object);

  return keys.reduce((result, key: string) => {
    result[key] = mapper(object[key], key);
    return result;
  }, {});
};

const filterObjectValues = (object, predicate) => {
  const keys = Reflect.ownKeys(object);

  return keys.filter(key => predicate(object[key])).map((key) => object[key]);
};

export const map = (collection, mapper) => Array.isArray(collection) ? collection.map(mapper) : mapObjectValues(collection, mapper);

export const updateBy = (collection, predicate, updater, merge = true) => {
  const _updaterFn = typeof updater === 'function' ? updater : () => updater;
  const _updater = merge ? (item) => ({ ...item, ..._updaterFn(item) }) : _updaterFn;

  return map(collection, item => predicate(item) ? _updater(item) : item);
};

export const updateById = (collection, id, updater, merge = true) => {
  const predicate = item => item.id === id;

  return updateBy(collection, predicate, updater, merge);
};

export const uniqueById = (array) => {
  const entries = array.map(item => [item.id, item]);
  const map = new Map(entries);

  return [...map.values()];
};

export const removeById = (collection, id) => {
  const predicate = item => item.id !== id;

  return Array.isArray(collection) ? collection.filter(predicate) : filterObjectValues(collection, predicate);
};

/*export function updateInArray(items, field, fieldValue, fields, doMerge = true) {
    return items.updateCollection(item => {
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
    return items.updateCollection(item => doMerge ? merge(item, cb(item)) : cb(item))
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

}*/