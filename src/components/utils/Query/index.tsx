import {
  ExtendedRequestOptions,
  request,
  RequestOptions
} from "../../../utils/api";
import { Query as QueryType } from "../../../utils/util";
import ErrorBoundary from "../ErrorBoundary";
import { useQueryOptions, useRequest } from "../QueryOptionsProvider";
import React, { useCallback, useEffect, useState } from "react";

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
  error: string | null;
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
  useConfig = true
}: QueryParams<T>): QueryReturn<T> => {
  // The default data/load/error triple
  const [dataLoadErr, setDataLoadErr] = useState<QueryType>({
    data: null,
    loading: true,
    error: null
  });
  const {
    domain = "",
    onRejected,
    headers,
    method,
    body,
    mode,
    signal
  } = requestOptions;
  const req = useConfig
    ? useRequest(useQueryOptions())
    : (path: string, options: RequestOptions) => request(domain, path, options);
  const [controller, setController] = useState<AbortController>();
  const [refresh, setRefresh] = useState(false);

  const manualUpdate = useCallback(
    (data: any) =>
      setDataLoadErr({
        data,
        loading: false,
        error: null
      }),
    []
  );

  // Check if the query prop has changed
  useEffect(() => {
    controller?.abort();
    const ctrl = new AbortController();
    const timeout = window.setTimeout(() => {
      req(query, {
        signal: signal ?? ctrl.signal,
        onRejected: (res) => {
          manualUpdate(undefined);
          onRejected?.(res);
        },
        headers,
        body,
        method,
        mode
      })
        .then((res) => {
          setDataLoadErr({ data: res, loading: false, error: null });
          onRead?.(res);
        })
        .catch((err) => {
          onRead?.(undefined as any);
          setDataLoadErr({
            data: null,
            loading: false,
            error: err.toString()
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

  return {
    data: dataLoadErr.data,
    loading: dataLoadErr.loading,
    error: dataLoadErr.error,
    manualUpdate,
    forceRefresh: () => setRefresh(!refresh)
  };
};

/**
 * The query component is a fetch wrapper that allows to directly add logic in the design of the react DOM architecture
 */
export const Query: <T = any>(
  p: QueryProps<T>
) => React.ReactElement<QueryProps<T>> = ({
  children,
  query,
  delay,
  onRead,
  requestOptions,
  useConfig = true
}) => {
  const { data, loading, error, forceRefresh, manualUpdate } = useQuery({
    query,
    delay,
    onRead,
    requestOptions,
    useConfig
  });

  return (
    <ErrorBoundary>
      {children({ data, loading, error, manualUpdate, forceRefresh })}
    </ErrorBoundary>
  );
};
