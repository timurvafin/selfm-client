export const isEmpty = (array: Array<any>) => {
  if (!array) {
    return true;
  }

  return array.length <= 0;
};

export const unique = (array: Array<any>) => array.filter((item, i) => array[i] === item);

