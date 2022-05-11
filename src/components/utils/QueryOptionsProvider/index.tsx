import { request, RequestOptions } from '../../../utils/api';
import { createContext, useContext } from 'react';

interface QueryOptions {
  requestMiddleware?: () => Promise<HeadersInit | undefined>;
  domain: string;
  parameterType?: QueryType;
  mode?: 'development' | 'production';
  verbosity?: number;
  idName?: string;
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

export const useRequest = () => {
  const {
    domain,
    mode: qMode,
    requestMiddleware: qRequestMiddleware,
  } = useQueryOptions();
  return function <T = any>(
    path: string,
    options: RequestOptions = { method: 'GET' }
  ) {
    const {
      headers = qRequestMiddleware(),
      body,
      method = 'GET',
      mode = qMode,
      signal,
    } = options;
    return request<T>(domain, path, { body, headers, method, mode, signal });
  };
};

export const QueryOptionsProvider = queryOptionsContext.Provider;
