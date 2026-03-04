import { v4 } from 'uuid';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { capitalize } from './string-utils';

const randomId = (length = 30) => {
  const randomId = new Date().getTime() + Math.random().toString().slice(2);

  return randomId.substring(0, length <= 30 ? length : 30);
};

const randomInteger = (min = 0, max = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomName = (suffix: string, prefix = false, separator = ' ') => {
  const customWords = ['amazing', 'great', 'lucky', 'my', 'new', 'our', 'super', 'the', 'welcome to'];
  const dictionaries = prefix ? [customWords, colors, animals] : [colors, animals];
  const randomName = uniqueNamesGenerator({ dictionaries, length: dictionaries.length, separator });

  return capitalize(`${randomName} ${suffix}`);
};

const randomString = (length: number) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+[]{}|;:,.<>!?';

  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((byte) => charset[byte % charset.length])
    .join('');
};

const uuid = () => v4();

export { randomId, randomInteger, randomName, randomString, uuid };
