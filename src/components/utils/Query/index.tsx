import { Query as QueryType } from '../../../utils/util';
import ErrorBoundary from '../ErrorBoundary';
import { useRequest } from '../QueryOptionsProvider';
import React, { useCallback, useEffect, useState } from 'react';

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
  const request = useRequest();
  const [controller, setController] = useState<AbortController>();
  const [refresh, setRefresh] = useState(false);

  const manualUpdate = useCallback(
    (data: any) =>
      setDataLoadErr({
        data,
        loading: dataLoadErr.loading,
        error: dataLoadErr.error,
      }),
    [dataLoadErr]
  );

  // Check if the query prop has changed
  useEffect(() => {
    controller?.abort();
    const ctrl = new AbortController();
    const timeout = window.setTimeout(() => {
      request(query, {
        signal: ctrl.signal,
      })
        .then((res) => {
          setDataLoadErr({ data: res, loading: false, error: null });
          onRead?.(res);
        })
        .catch((err) => {
          if (err.name == 'AbortError') return;
          setDataLoadErr({
            data: null,
            loading: false,
            error: err.toString(),
          });
        });
    }, delay ?? 0);
    setController(ctrl);
    setDataLoadErr({ data: null, loading: true, error: null });

    return () => {
      ctrl?.abort();
      window.clearTimeout(timeout);
    };
  }, [query, refresh]);

  return (
    <ErrorBoundary>
      {children(
        dataLoadErr.data,
        dataLoadErr.loading,
        dataLoadErr.error,
        manualUpdate,
        () => setRefresh(!refresh)
      )}
    </ErrorBoundary>
  );
};

export default Query;
