import hash from 'object-hash';

export const setCache = (key: string, value: any, expires: number = 300) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + expires);
  localStorage.setItem(
    `store-${key}`,
    JSON.stringify({
      expireDate: date.toISOString(),
      data: value,
    })
  );
};

export const getCache = (key: string) => {
  let v = localStorage.getItem(`store-${key}`);
  if (v == null) return undefined;
  const o = JSON.parse(v);
  const { expireDate, data } = o;
  const date = new Date(expireDate);
  if (new Date().getTime() > date.getTime()) return undefined;
  return data;
};

export const clearCache = (key: string) => {
  localStorage.removeItem(key);
};

export const createCacheKey = (s: string) => hash(s);
