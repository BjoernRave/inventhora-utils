import { format, isDate, parse } from 'date-fns';
import { DateFormat, TopBannerMessages } from './types';
import { UAParser } from 'ua-parser-js';

export const isServer = typeof window === 'undefined';

export const isDev = process.env.NODE_ENV === 'development';

export const dateTimeFormat = 'dd.MM.yyyy - HH:mm';

export const timeFormat = 'HH:mm';

export const dateFormat = 'dd.MM.yyyy';

export const getDateTimeFormat = (dateString: DateFormat) => {
  switch (dateString) {
    case 'daytime':
      return dateTimeFormat;

    case 'day':
      return dateFormat;

    case 'time':
      return timeFormat;
  }
};

export const uniquifyArray = (a: any[] | undefined) => {
  if (!a || !Array.isArray(a)) return [];
  const seen = {};
  return a.filter(item => {
    if (!item) return false;
    return (seen as any).hasOwnProperty(item) ? false : (seen[item] = true);
  });
};

export const uniquifyObjectArray = (a: any[] | undefined, id: string) => {
  if (!a || !Array.isArray(a)) return [];
  const seen = {};
  return a.filter(item => {
    if (!item) return false;
    if (!item[id]) return false;
    return (seen as any).hasOwnProperty(item[id])
      ? false
      : (seen[item[id]] = true);
  });
};

export const capitalizeString = (string: string) => {
  return string[0].toUpperCase() + string.slice(1, string.length);
};

export const isValidDate = (d: any) => {
  return d instanceof Date && !isNaN(d as any);
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'object') {
    return getErrorMessage(error[Object.keys(error)[0]]);
  }

  return error;
};

export const cleanObject = <T>(object: T): T => {
  const newObject = {} as any;

  Object.keys(object).map(entry => {
    if (
      object[entry] !== 'N/A' &&
      (typeof object[entry] === 'boolean' || Boolean(object[entry]))
    ) {
      newObject[entry] = object[entry];
    }
  });
  return newObject;
};

export const removeFromArray = (items: string[], array: string[]) => {
  const newArray = Array.from(array);
  items.forEach(item => {
    newArray.splice(
      newArray.findIndex(val => val === item),
      1
    );
  });
  return newArray;
};

export const getBannerMessage = (settings: Partial<any>): TopBannerMessages => {
  const trialDate = new Date();
  trialDate.setDate(trialDate.getDate() + 5);

  if (settings?.type === 'trial' && new Date(settings?.dueDate) < trialDate) {
    return 'trialEnd';
  }
  return null;
};

export const generateRandomString = (length: number) => {
  let result = '';
  const specials = '!@#$%^&*';
  const numbers = '0123456789';
  const smallChars = 'abcdefghijklmnopqrstuvwxyz';
  const bigChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < length / 4; i++) {
    result += specials.charAt(Math.floor(Math.random() * specials.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    result += smallChars.charAt(Math.floor(Math.random() * smallChars.length));
    result += bigChars.charAt(Math.floor(Math.random() * bigChars.length));
  }
  return result;
};

export const getLanguages = (t: any) => {
  return [
    { value: 'es', label: t('common:spanish') },
    { value: 'en', label: t('common:english') },
    { value: 'pt', label: t('common:portuguese') },
    { value: 'de', label: t('common:german') },
  ];
};

export const formatDate = (
  date: string | number | Date,
  dateString: DateFormat,
  timezone?: string
) => {
  if (!date || date === 'N/A') return date;

  const actualDate = isDate(date) ? (date as Date) : new Date(date);

  return format(actualDate, getDateTimeFormat(dateString));
};

export const parseDate = (date: string, dateString: DateFormat) => {
  return parse(date, getDateTimeFormat(dateString), new Date());
};

export const roundTo = (
  number: number,
  decimals: number,
  asNumber?: boolean
) => {
  const x = Math.pow(10, Number(decimals) + 1);
  if (asNumber) return Number((Number(number) + 1 / x).toFixed(decimals));
  return (Number(number) + 1 / x).toFixed(decimals);
};

export const generateSlug = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

export const getSubdomain = (url: string) => {
  if (
    url === 'inventhora.com' ||
    (url.indexOf('localhost') === 0 && url.indexOf('inventhora') === -1)
  ) {
    return 'dev';
  }

  const currentBranch = process.env.VERCEL_GITHUB_COMMIT_REF?.toLowerCase()
    ?.replace('/', '-')
    ?.replace('_', '-');

  if (currentBranch !== 'master') {
    return 'testing';
  }

  return url.split('.')[0];
};

export const parseNumber = (number: any) => {
  if (number === null || number === undefined || number === '') return null;
  if (typeof number === 'number') return number;
  return Number(number.replace(',', '.'));
};

export const removeFromObjectArray = (
  array: object[],
  key: string,
  value: any
): any[] => {
  const newArray = Array.from(array);

  newArray.splice(
    newArray.findIndex(item => item[key] === value),
    1
  );

  return newArray;
};

export const getObjectKeyByString = (o: any, s: string) => {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  const a = s.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    if (!Boolean(o)) return null;
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

export const constructDimensionString = (
  dimensions: any,
  lengthUnit: string
) => {
  if (!dimensions.width && !dimensions.depth) {
    return `${dimensions.height}${lengthUnit}.`;
  }

  if (!dimensions.depth) {
    return `${dimensions.height}x${dimensions.width}${lengthUnit}.`;
  }

  return `${dimensions.height}x${dimensions.width}x${dimensions.depth}${lengthUnit}.`;
};

export const createProductFullName = ({
  product,
  weightUnit,
  lengthUnit,
  t,
}: {
  product: Partial<{ dimensions: any } & any>;
  weightUnit: string;
  lengthUnit: string;
  t: any;
}) => {
  const { name, material, color, weight, dimensions, quantity } = product;

  let baseString = name;

  if (material) {
    baseString = `${baseString} ${material}`;
  }

  if (color) {
    baseString = `${baseString} ${color}`;
  }

  if (weight) {
    baseString = `${baseString} ${weight}${weightUnit}.`;
  }

  if (dimensions) {
    baseString = `${baseString} ${constructDimensionString(
      dimensions,
      lengthUnit
    )}`;
  }

  if (quantity) {
    baseString = `${baseString} ${quantity}${t('common:pieces', {
      count: quantity,
    })}`;
  }

  return baseString;
};

export const isMobile = (ctx: any) => {
  const uaParser = new UAParser(
    ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent
  );

  const device = uaParser.getDevice().type;

  return device === 'mobile' || device === 'tablet';
};
