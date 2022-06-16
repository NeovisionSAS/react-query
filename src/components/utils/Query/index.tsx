import {
  ExtendedRequestOptions,
  request,
  RequestOptions,
} from '../../../utils/api';
import { Query as QueryType } from '../../../utils/util';
import ErrorBoundary from '../ErrorBoundary';
import { useQueryOptions, useRequest } from '../QueryOptionsProvider';
import React, { useCallback, useEffect, useState } from 'react';

export type DataHandler<T> = (data: T) => any;

interface QueryParams<T = any> {
  query: string;
  delay?: number;
  onRead?: DataHandler<T>;
  requestOptions?: ExtendedRequestOptions;
  useConfig?: boolean;
}

interface QueryReturn<T> {
  data: T;
  loading: boolean;
  error?: string;
  manualUpdate: DataHandler<T>;
  forceRefresh: () => any;
}
interface QueryProps<T = any> extends QueryParams<T> {
  children: (qReturn: QueryReturn<T>) => JSX.Element;
}

export const useQuery = <T = any,>({
  query,
  delay,
  onRead,
  requestOptions = {},
  useConfig = true,
}: QueryParams<T>): QueryReturn<T> => {
  // The default data/load/error triple
  const [dataLoadErr, setDataLoadErr] = useState<QueryType>({
    data: undefined,
    loading: true,
    error: undefined,
  });
  const { domain = '', ...options } = requestOptions;

  let req: <T = any>(path: string, options?: RequestOptions) => Promise<T>;
  if (useConfig) req = useRequest(useQueryOptions());
  else
    req = (path: string, options?: RequestOptions) =>
      request(domain, path, options);

  const [controller, setController] = useState<AbortController>();
  const [refresh, setRefresh] = useState(false);

  const manualUpdate = useCallback(
    (data: T) =>
      setDataLoadErr({
        data,
        loading: false,
        error: undefined,
      }),
    []
  );

  // Check if the query prop has changed
  useEffect(() => {
    controller?.abort();
    const ctrl = new AbortController();
    const timeout = window.setTimeout(() => {
      const { signal, ...others } = options;
      req(query, {
        signal: signal ?? ctrl.signal,
        ...others,
      })
        .then((res) => {
          setDataLoadErr({ data: res, loading: false, error: undefined });
          onRead?.(res);
        })
        .catch((err) => {
          setDataLoadErr({
            data: undefined,
            loading: false,
            error: err.toString(),
          });
        });
    }, delay ?? 0);
    setController(ctrl);
    setDataLoadErr({ data: undefined, loading: true, error: undefined });

    return () => {
      ctrl?.abort();
      window.clearTimeout(timeout);
    };
  }, [query, refresh]);

  return {
    ...dataLoadErr,
    manualUpdate,
    forceRefresh: () => setRefresh(!refresh),
  };
};

/**
 * The query component is a fetch wrapper that allows to directly add logic in the design of the react DOM architecture
 */
export const Query: <T = any>(
  p: QueryProps<T>
) => React.ReactElement<QueryProps<T>> = ({
  children,
  useConfig = true,
  ...qRest
}) => {
  const { loader } = useQueryOptions();
  const { loading, ...qData } = useQuery({
    ...qRest,
    useConfig,
  });

  // Always call to maintain the hooks
  const render = children({ loading, ...qData });

  return (
    <ErrorBoundary>
      {loading && loader.autoload ? (
        <>{loader.loader ?? <div>Loading data...</div>}</>
      ) : (
        render
      )}
    </ErrorBoundary>
  );
};
