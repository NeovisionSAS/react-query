import { FormEvent } from 'react';
import { PartialBy, RequiredBy } from '../types/global';
import { createCacheKey, setCache } from './cache';
import { requestError, requestWarn } from './log';
import { buildHeader, restructureData } from './util';
import { XHRFetch } from './xhr';
import { XHRProgress } from './xhr/progress';

export type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
export type QueryParamType = 'path' | 'queryString' | 'none';

interface LoaderOptions {
  loader?: JSX.Element;
  autoload?: boolean;
}

export type GetHeaders = () => Promise<HeadersInit>;

export type EnvMode = 'development' | 'production';

export interface BaseQueryOptions extends Rejectable {
  headers?: GetHeaders;
  parameterType?: QueryParamType;
  mode?: EnvMode;
  verbosity?: number;
  idName?: string;
  /**
   * Add a `delay` before the request is sent.
   * Very useful to test whenever you need to show some loading.
   */
  delay?: number;
  cache?: number;
}

export interface Rejectable {
  onRejected?: (rej: Reject) => any;
}

export interface Reject<T = any> {
  status: number;
  statusText: string;
  url: string;
  data: T;
}

export type RequestData = object | string | FormEvent | FormData;

export interface RequestOptions extends BaseQueryOptions {
  method?: Method;
  data?: RequestData;
  signal?: AbortSignal;
  progress?: XHRProgress;
}

interface Domain {
  domain: string;
}

interface Cacheable {
  cache?: number;
}

export interface QueryOptions extends BaseQueryOptions, Domain, Cacheable {
  loader?: LoaderOptions;
}

export type RealQueryOptions = RequiredBy<
  QueryOptions,
  'mode' | 'verbosity' | 'parameterType' | 'idName'
>;

export type RequestOptionsWithDomain = RequestOptions & Domain & Cacheable;
export type RequestOptionsWithOptionalDomain = PartialBy<
  RequestOptionsWithDomain,
  'domain'
>;

export const requestOptionsMerge = <T extends RequestOptions = RequestOptions>(
  options: RequestOptions[],
  override = false
): T => {
  if (override) return Object.merge(...options);
  return Object.merge(...options, {
    onRejected: (rej) => options.forEach((o) => o.onRejected?.(rej)),
  });
};

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
    data,
    cache,
    ...rest
  } = options;
  const { body, contentType } = restructureData(data);

  const req = (headers: HeadersInit) => {
    const endpoint = `${domain}/${path}`;
    const cacheHash = cache != 0 ? createCacheKey(path, data) : '';
    return XHRFetch(endpoint, {
      headers: buildHeader(headers, contentType),
      method,
      body,
      ...rest,
    })
      .then((res) => {
        setCache(cacheHash, res, cache);
        return res;
      })
      .catch((err) => {
        if (err.name == 'AbortError') requestWarn(mode, 0, 0, err.message);
        else {
          requestError(method, endpoint, `${err.status} ${err.statusText}`);
          onRejected?.(err);
          throw err;
        }
      });
  };

  return headers ? headers().then(req) : req({});
};
