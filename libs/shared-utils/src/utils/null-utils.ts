/* eslint-disable @typescript-eslint/no-explicit-any */
const isNullOrEmpty = (item: any) => {
  if (typeof item === 'object') {
    return Object.keys(item).length === 0;
  } else {
    return item === undefined || item === null;
  }
};

const removeNullable = <T>(object: T) => {
  const obj = object as any;

  Object.getOwnPropertyNames(object as any).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }

    if ((obj[key] && typeof obj[key] === 'object') || typeof obj[key] === 'function') {
      removeNullable(obj[key]);
    }
  });

  return obj as T;
};

export { isNullOrEmpty, removeNullable };
