import React, { useCallback, useEffect, useState } from 'react';
import { Query as QueryType } from '../../../utils/util';
import ErrorBoundary from '../ErrorBoundary';
import { useQueryOptions } from '../QueryOptionsProvider';

interface QueryProps<T = any> {
  children: (
    data: T,
    loading: boolean,
    error: string | null,
    manualUpdate: (data: T) => void,
    forceRefresh: () => void
  ) => JSX.Element;
  query: string;
  method?: 'GET' | 'POST';
  delay?: number;
  body?: any;
  onRead?: (data: T) => void;
}

/**
 * The query component is a fetch wrapper that allows to directly add logic in the design of the react DOM architecture
 */
const Query: <T = any>(
  p: QueryProps<T>
) => React.ReactElement<QueryProps<T>> = ({
  children,
  query,
  method,
  delay,
  body,
  onRead,
}) => {
  // The default data/load/error triple
  const [dataLoadErr, setDataLoadErr] = useState<QueryType>({
    data: null,
    loading: true,
    error: null,
  });
  const [timeout, setTimeout] = useState<number>();
  const [refresh, setRefresh] = useState(false);
  const queryOptions = useQueryOptions();

  let controller: AbortController | null;

  const manualUpdate = useCallback(
    (data: any) =>
      setDataLoadErr({
        data,
        loading: dataLoadErr.loading,
        error: dataLoadErr.error,
      }),
    [dataLoadErr]
  );
  const forceRefresh = useCallback(() => setRefresh(!refresh), [refresh]);

  // Check if the query prop has changed
  useEffect(() => {
    setDataLoadErr({ data: null, loading: true, error: null });
    timeout != null && window.clearTimeout(timeout);
    setTimeout(
      window.setTimeout(() => {
        const { requestMiddleware, domain, protocol } = queryOptions;

        // Fetch request handler
        const req = (headers: HeadersInit | undefined) => {
          const filteredHeaders = Object.fromEntries<any>(
            Object.entries(headers as any).filter(
              ([key]) => !key.includes('Content-Type')
            )
          );
          controller && controller.abort();
          controller = new AbortController();
          fetch(`${protocol ?? 'https'}://${domain}/${query}`, {
            headers: filteredHeaders,
            signal: controller.signal,
          })
            .then((res) => {
              if (res.status != 200) throw Error(res.statusText ?? 'Error');
              return res.json();
            })
            .then((res) => {
              setDataLoadErr({ data: res, loading: false, error: null });
              onRead?.(res);
            })
            .catch((err) => {
              if (err.name == 'AbortError') return;
              console.error('Query', err);
              setDataLoadErr({
                data: null,
                loading: false,
                error: err.toString(),
              });
            });
        };

        // Launch de middlware if there is one
        requestMiddleware ? requestMiddleware().then(req) : req({});
      }, delay ?? 0)
    );
  }, [query, refresh]);

  return (
    <ErrorBoundary>
      {children(
        dataLoadErr.data,
        dataLoadErr.loading,
        dataLoadErr.error,
        manualUpdate,
        forceRefresh
      )}
    </ErrorBoundary>
  );
};

export default Query;
