const camelCase = (string: string) => {
  return string
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

const capitalize = (string: string): string => {
  return string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const startsWithStringInArray = (string: string, array: string[]) => array.some((s) => string.startsWith(s));

export { camelCase, capitalize, startsWithStringInArray };
