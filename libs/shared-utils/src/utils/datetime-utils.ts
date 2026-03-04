import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const addTime = (timeString: string, datetime?: Date | string | null, format = 'YYYY-MM-DD HH:mm:ss') => {
  const match = timeString.match(/(\d+)([a-zA-Z]+)/);

  if (!match) {
    throw new Error('Invalid time string format');
  }

  const [, value, unit] = match;
  const parsedValue = parseInt(value, 10);
  let date = datetime ? dayjs(datetime) : dayjs();

  switch (unit) {
    case 'm':
      date = date.add(parsedValue, 'minute');
      break;
    case 'h':
      date = date.add(parsedValue, 'hour');
      break;
    case 'd':
      date = date.add(parsedValue, 'day');
      break;
    case 'w':
      date = date.add(parsedValue, 'week');
      break;
    case 'M':
      date = date.add(parsedValue, 'month');
      break;
    case 'y':
      date = date.add(parsedValue, 'year');
      break;
    default:
      throw new Error('Invalid unit provided');
  }

  return date.format(format);
};

const localDate = (datetime?: Date | string | null, format = 'DD-MM-YYYY HH:mm') => {
  return dayjs
    .utc(datetime ?? dayjs())
    .local()
    .format(format);
};

const utcDate = (datetime?: Date | string | null, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(datetime ?? dayjs())
    .utc()
    .format(format);
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { addTime, sleep, localDate, utcDate };
