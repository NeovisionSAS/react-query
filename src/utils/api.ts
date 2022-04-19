import { Mode } from '../types/global';
import { queryWarn } from './log';

export type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface SetDataOptions {
  middleware?: Promise<HeadersInit | undefined>;
  method?: Method;
  body?: string;
  mode?: Mode;
}

export const setData = function <T = any>(
  domain: string,
  path: string,
  options: SetDataOptions = { method: 'POST' }
): Promise<T> {
  const { body, method, middleware, mode } = options;

  const req = (headers: HeadersInit | undefined) =>
    fetch(`${domain}/${path}`, {
      method,
      headers,
      body,
    }).then(
      (res: Response) => {
        if (res.ok) {
          try {
            return res.json();
          } catch (e) {
            queryWarn(
              mode ?? 'production',
              0,
              0,
              `Could not parse response to json`,
              res
            );
            return res.text();
          }
        }
        return res.text().then((t) => {
          throw new Error(t);
        });
      },
      (reject) => {
        console.error(reject);
      }
    );

  return middleware ? middleware.then(req) : req({});
};
