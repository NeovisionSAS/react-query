import { request, RequestOptions } from '../../../utils/api';
import { createContext, useContext } from 'react';

interface LoaderOptions {
  loader?: JSX.Element;
  autoload?: boolean;
}

interface QueryOptions {
  requestMiddleware?: () => Promise<HeadersInit>;
  domain: string;
  parameterType?: QueryType;
  mode?: 'development' | 'production';
  verbosity?: number;
  idName?: string;
  onRejected?: (res: Response) => any;
  loader?: LoaderOptions;
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
  { headers: rHeaders, method: rMethod = 'GET', ...rRest }: RequestOptions = {
    method: 'GET',
  }
) => {
  const {
    domain,
    requestMiddleware: qRequestMiddleware = rHeaders,
    ...qRest
  } = useQueryOptions();
  return function <T = any>(
    path: string,
    options: RequestOptions = { method: 'GET' }
  ) {
    return request<T>(
      domain,
      path,
      Object.merge(options, {
        headers: qRequestMiddleware,
        method: rMethod,
        ...Object.merge(rRest, qRest, options),
      })
    );
  };
};

export const QueryOptionsProvider = queryOptionsContext.Provider;
