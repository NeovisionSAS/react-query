import { PartialBy, RequiredBy } from '../types/global';
import { requestError, requestWarn } from './log';
import { buildHeader, restructureData } from './util';
import { XHRFetch } from './xhr';
import { XHRProgress } from './xhr/progress';
import { FormEvent } from 'react';

export type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
export type QueryParamType = 'path' | 'queryString';

interface LoaderOptions {
  loader?: JSX.Element;
  autoload?: boolean;
}

export type GetHeaders = () => Promise<HeadersInit>;

export interface BaseQueryOptions {
  headers?: GetHeaders;
  parameterType?: QueryParamType;
  mode?: 'development' | 'production';
  verbosity?: number;
  idName?: string;
  onRejected?: (rej: Reject) => any;
  delay?: number;
}

interface Reject {
  status: number;
  statusText: string;
  url: string;
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
    data,
    ...rest
  } = options;
  const { body, contentType } = restructureData(data);

  const req = (headers: HeadersInit) => {
    const endpoint = `${domain}/${path}`;
    return XHRFetch(endpoint, {
      headers: buildHeader(headers, contentType),
      method,
      body,
      ...rest,
    }).catch((err) => {
      if (err.name == 'AbortError') requestWarn(mode, 0, 0, err.message);
      else {
        requestError(method, endpoint, `${err.status} ${err.statusText}`);
        onRejected?.(err);
        throw new Error(err);
      }
    });
  };

  return headers ? headers().then(req) : req({});
};
