import { queryError, queryWarn, queryWarn as requestWarn } from './log';
import { PartialBy, RequiredBy } from '../types/global';

export type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
export type QueryType = 'path' | 'queryString';

interface LoaderOptions {
  loader?: JSX.Element;
  autoload?: boolean;
}

export interface BaseQueryOptions {
  headers?: () => Promise<HeadersInit>;
  parameterType?: QueryType;
  mode?: 'development' | 'production';
  verbosity?: number;
  idName?: string;
  onRejected?: (res: Response) => any;
  delay?: number;
}

export interface RequestOptions extends BaseQueryOptions {
  method?: Method;
  body?: string;
  signal?: AbortSignal;
}

interface Domain {
  domain: string;
}

export interface QueryOptions extends BaseQueryOptions, Domain {
  loader?: LoaderOptions;
}

export type RealQueryOptions = RequiredBy<
  QueryOptions,
  'mode' | 'verbosity' | 'parameterType' | 'idName'
>;

export type RequestOptionsWithDomain = RequestOptions & Domain;
export type RequestOptionsWithOptionalDomain = PartialBy<
  RequestOptionsWithDomain,
  'domain'
>;

export const request = function <T = any>(
  domain: string,
  path: string,
  options: RequestOptions = {
    method: 'GET',
  }
): Promise<T> {
  const {
    method = 'GET',
    headers,
    mode = 'production',
    onRejected,
    ...rest
  } = options;

  const req = (headers: HeadersInit) => {
    return fetch(`${domain}/${path}`, {
      headers,
      method,
      ...rest,
    })
      .then((res) => {
        if (!res.ok) {
          queryError(`${res.url} ${res.status} ${res.statusText}`);
          onRejected?.(res);
          return Promise.reject(`${res.status} ${res.statusText}`);
        }
        return res.text().then((t) => {
          try {
            if (res.headers.get('Content-Type')?.includes('application/json'))
              return JSON.parse(t);
          } catch (e) {
            requestWarn(mode, 0, 0, `Could not parse response to json`, res);
          }
          return t;
        });
      })
      .catch((err) => {
        if (err.name == 'AbortError') queryWarn(mode, 0, 0, err.message);
        else throw new Error(err);
      });
  };

  return headers ? headers().then(req) : req({});
};
