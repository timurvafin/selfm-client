export const isEmpty = (array: Array<any>) => {
  if (!array) {
    return true;
  }

  return array.length <= 0;
};

export const unique = (array: Array<any>) => array.filter((item, i) => array[i] === item);

const makeObject = (keys: Array<string|number>, values: Array<any>) => {
  return keys.reduce((result, key: string, index) => {
    result[key] = values[index];
    return result;
  }, {});
};

export const mapObjectValues = <T, U>(object: { [key: string]: T }, mapper: (value: T, key: string) => U): { [K in keyof typeof object]: U } => {
  const keys = Reflect.ownKeys(object);

  return keys.reduce((result, key: string) => {
    result[key] = mapper(object[key], key);
    return result;
  }, {});
};

export const filterObjectValues = (object, predicate) => {
  const keys = Reflect.ownKeys(object);

  return keys.filter(key => predicate(object[key])).reduce((result, key: string) => {
    result[key] = object[key];
    return result;
  }, {});
};
