import { createContext, useContext } from 'react';

interface QueryOptions {
  requestMiddleware?: () => Promise<HeadersInit | undefined>;
  domain: string;
  parameterType?: 'path' | 'queryString';
  mode?: 'development' | 'production';
  verbosity?: number;
}

const queryOptionsContext = createContext<QueryOptions>({
  domain: '',
  parameterType: 'path',
  mode: 'production',
  verbosity: 1,
});

export const useQueryOptions = () => {
  const ctx = useContext(queryOptionsContext);
  if (!ctx) throw new Error("No context for 'useQueryOptions'");
  return ctx;
};

export const QueryOptionsProvider = queryOptionsContext.Provider;
