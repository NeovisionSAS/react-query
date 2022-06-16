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
  { method: rMethod = 'GET', ...rRest }: RequestOptions = {
    method: 'GET',
  }
) => {
  const { domain, ...qRest } = useQueryOptions();

  return <T = any,>(
    path: string,
    options: RequestOptions = { method: 'GET' }
  ) =>
    request<T>(
      domain,
      path,
      Object.merge<RequestOptions>(rRest, qRest, options)
    );
};

export const QueryOptionsProvider = queryOptionsContext.Provider;
