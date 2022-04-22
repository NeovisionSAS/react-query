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
  return ctx as Required<QueryOptions>;
};

export const QueryOptionsProvider = queryOptionsContext.Provider;
