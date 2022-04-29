import { Mode } from '../types/global';
import { queryWarn } from './log';

export type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface SetDataOptions {
  headers?: Promise<HeadersInit | undefined>;
  method?: Method;
  body?: string;
  mode?: Mode;
}

export const setData = function <T = any>(
  domain: string,
  path: string,
  options: SetDataOptions = { method: 'POST' }
): Promise<T> {
  const { body, method, headers, mode } = options;

  const req = (headers: HeadersInit | undefined) =>
    fetch(`${domain}/${path}`, {
      method,
      headers: headers ? headers : {},
      body,
    }).then(
      (res: Response) => {
        if (res.ok) {
          return res.text().then((t) => {
            try {
              return JSON.parse(t);
            } catch (e) {
              queryWarn(
                mode ?? 'production',
                0,
                0,
                `Could not parse response to json`,
                res
              );
              return t;
            }
          });
        }
        return res.text().then((t) => {
          throw new Error(t);
        });
      },
      (reject) => {
        console.error(reject);
      }
    );

  return headers ? headers.then(req) : req({});
};
