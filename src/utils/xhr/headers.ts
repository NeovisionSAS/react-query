/**
 * Parse headers from a string
 * @param headers
 * @returns Headers
 */
export const parseHeaders = (headers: string): Headers => {
  const arr = headers.trim().split(/[\r\n]+/);
  const headerMap = {};
  arr.forEach((line) => {
    const parts = line.split(": ");
    const header = parts.shift();
    const value = parts.join(": ");
    (headerMap as any)[header as string] = value;
  });
  return new Headers(headerMap);
};

/**
 * Parse data if it is json
 * @param headers
 * @param data
 * @returns data
 */
export const applyHeaders = (headers: Headers, data: any) => {
  if (headers.get("content-type")?.includes("application/json"))
    return JSON.parse(data);
  return data;
};

/**
 * Set non null request headers
 */
export const setRequestHeaders = (r: XMLHttpRequest, headers: HeadersInit) => {
  Object.entries(headers).forEach((v) => {
    const [key, val] = v;
    if (val != null) r.setRequestHeader(key, val);
  });
};
