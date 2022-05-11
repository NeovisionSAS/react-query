import { Mode } from '../types/global';
import { queryError, queryWarn as requestWarn } from './log';

export type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';

export interface RequestOptions {
  headers?: Promise<HeadersInit | undefined>;
  method?: Method;
  body?: string;
  mode?: Mode;
  signal?: AbortSignal;
}

export const request = function <T = any>(
  domain: string,
  path: string,
  options: RequestOptions = { method: 'GET' }
): Promise<T> {
  const {
    body,
    method = 'GET',
    headers,
    mode = 'production',
    signal,
  } = options;

  const req = (headers: HeadersInit | undefined) => {
    return fetch(`${domain}/${path}`, {
      headers,
      method,
      body,
      signal,
    }).then(
      (res: Response) => {
        if (res.ok) {
          return res.text().then((t) => {
            try {
              if ((headers as any)?.['Content-Type'] == 'application/json')
                return JSON.parse(t);
            } catch (e) {
              requestWarn(mode, 0, 0, `Could not parse response to json`, res);
            }
            return t;
          });
        }
        return res.text().then((t) => {
          queryError(t);
          throw new Error(t);
        });
      },
      (reject) => queryError(reject)
    );
  };

  return headers ? headers.then(req) : req({});
};
