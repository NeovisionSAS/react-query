import { createContext, useContext } from 'react';

interface QueryOptions {
  requestMiddleware?: () => Promise<HeadersInit | undefined>;
  domain: string;
  protocol?: 'http' | 'https';
  parameterType?: 'path' | 'queryString';
}

const queryOptionsContext = createContext<QueryOptions>({
  domain: '',
  protocol: 'https',
});

export const useQueryOptions = () => {
  const ctx = useContext(queryOptionsContext);
  if (!ctx) throw new Error("No context for 'useQueryOptions'");
  return ctx;
};

export const QueryOptionsProvider = queryOptionsContext.Provider;
