import { createContext, useContext } from 'react';

interface QueryOptions {
  requestMiddleware?: () => Promise<HeadersInit | undefined>;
  domain: string;
  parameterType?: 'path' | 'queryString';
}

const queryOptionsContext = createContext<QueryOptions>({
  domain: '',
});

export const useQueryOptions = () => {
  const ctx = useContext(queryOptionsContext);
  if (!ctx) throw new Error("No context for 'useQueryOptions'");
  return ctx;
};

export const QueryOptionsProvider = queryOptionsContext.Provider;
