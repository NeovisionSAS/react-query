import { PartialBy, RequiredBy } from '../types/global';
import { queryWarn } from './log';
import { buildHeader, restructureData } from './util';
import { XHRFetch } from './xhr';
import { FormEvent } from 'react';
import { XHRProgress } from './xhr/progress';

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

export type RequestData = string | FormEvent | FormData;

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
    return XHRFetch(`${domain}/${path}`, {
      headers: buildHeader(headers, contentType),
      method,
      body,
      ...rest,
    }).catch((err) => {
      if (err.name == 'AbortError') queryWarn(mode, 0, 0, err.message);
      else throw new Error(err);
    });
  };

  return headers ? headers().then(req) : req({});
};
