import { request, RequestOptions } from '../../../utils/api';
import { createContext, useContext } from 'react';

interface QueryOptions {
  requestMiddleware?: () => Promise<HeadersInit>;
  domain: string;
  parameterType?: QueryType;
  mode?: 'development' | 'production';
  verbosity?: number;
  idName?: string;
  onRejected?: (res: Response) => any;
}

export type QueryType = 'path' | 'queryString';

const queryOptionsContext = createContext<QueryOptions>({
  domain: '',
  parameterType: 'path',
  mode: 'production',
  verbosity: 1,
  idName: 'id',
});

export const useQueryOptions = (): Required<QueryOptions> => {
  const ctx = useContext(queryOptionsContext);
  if (!ctx) throw new Error("No context for 'useQueryOptions'");
  if (!ctx.idName) ctx.idName = 'id';
  return ctx as Required<QueryOptions>;
};

export const useRequest = (
  {
    body: rBody,
    headers: rHeaders,
    method: rMethod = 'GET',
    mode: rMode,
    onRejected: rOnRejected,
    signal: rSignal,
  }: RequestOptions = { method: 'GET' }
) => {
  const {
    domain,
    mode: qMode = rMode,
    requestMiddleware: qRequestMiddleware = () => rHeaders,
    onRejected: qOnRejected = rOnRejected,
  } = useQueryOptions();
  return function <T = any>(
    path: string,
    options: RequestOptions = { method: 'GET' }
  ) {
    const {
      headers = qRequestMiddleware?.(),
      body = rBody,
      method = rMethod,
      mode = qMode,
      signal = rSignal,
      onRejected = qOnRejected,
    } = options;
    return request<T>(domain, path, {
      body,
      headers,
      method,
      mode,
      signal,
      onRejected,
    });
  };
};

export const QueryOptionsProvider = queryOptionsContext.Provider;
