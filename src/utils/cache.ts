import hash from 'object-hash';
import { requestLog } from './log';

const createKey = (k: string = '') => `react-query-${k}`;

export const setCache = (key: string, value: any, expires: number = 300) => {
  if (expires == 0) return;
  const date = new Date();
  date.setSeconds(date.getSeconds() + expires);
  try {
    localStorage.setItem(
      createKey(key),
      JSON.stringify({
        expireDate: date.toISOString(),
        data: value,
      })
    );
  } catch (e) {}
};

export const getCache = (key: string) => {
  const k = createKey(key);
  let v = localStorage.getItem(k);
  if (v == null) return undefined;
  const o = JSON.parse(v);
  const { expireDate, data } = o;
  const date = new Date(expireDate);
  if (new Date().getTime() > date.getTime()) {
    clearCache(k);
    return undefined;
  }
  return data;
};

export const clearCache = (key: string) => {
  localStorage.removeItem(key);
};

const cleanCache = () => {
  const p = createKey();
  let total = 0;
  for (let k of Object.keys(localStorage).filter((k) => k.startsWith(p))) {
    const v = localStorage.getItem(k)!;
    const o = JSON.parse(v);
    const { expireDate } = o;
    const date = new Date(expireDate);
    if (new Date().getTime() > date.getTime()) clearCache(k);
    total += (k.length + v.length) * 2;
  }
  requestLog(
    'development',
    0,
    0,
    `Cleaned ${(total / 1024).toFixed(2)} KB from localStorage`
  );
};

export const createCacheKey = (s: string, data?: any) => {
  if (data) {
    if (data.constructor?.name == 'FormData')
      return hash(hash(s) + hash(new URLSearchParams(data).toString()));
    return hash(hash(s) + hash(data));
  }
  return hash(s);
};

// Clean straight away
cleanCache();

// Clean every 6mins
setInterval(() => {
  cleanCache();
}, 1000 * 360);
