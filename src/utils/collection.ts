const mapObjectValues = (object, mapper) => {
  const keys = Reflect.ownKeys(object);

  return keys.map((key) => mapper(object[key]));
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

export const unique = (array) => array.filter((item, i) => array[i] === item);

export const removeById = (collection, id) => {
  const predicate = item => item.id !== id;

  return Array.isArray(collection) ? collection.filter(predicate) : filterObjectValues(collection, predicate);
};