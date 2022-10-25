import hash from 'object-hash';

const createKey = (k: string = '') => `react-query-${k}`;

export const setCache = (key: string, value: any, expires: number = 300) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + expires);
  localStorage.setItem(
    createKey(key),
    JSON.stringify({
      expireDate: date.toISOString(),
      data: value,
    })
  );
};

export const getCache = (key: string) => {
  let v = localStorage.getItem(createKey(key));
  if (v == null) return undefined;
  const o = JSON.parse(v);
  const { expireDate, data } = o;
  const date = new Date(expireDate);
  if (new Date().getTime() > date.getTime()) {
    clearCache(key);
    return undefined;
  }
  return data;
};

export const clearCache = (key: string) => {
  localStorage.removeItem(createKey(key));
};

const cleanCache = () => {
  const p = createKey();
  for (let k of Object.keys(localStorage).filter((k) => k.startsWith(p))) {
    const v = localStorage.getItem(k)!;
    const o = JSON.parse(v);
    const { expireDate } = o;
    const date = new Date(expireDate);
    if (new Date().getTime() > date.getTime()) clearCache(k);
  }
};

export const createCacheKey = (s: string) => hash(s);

cleanCache();
