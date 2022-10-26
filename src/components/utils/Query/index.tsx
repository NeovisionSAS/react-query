import React, { useCallback, useEffect, useState } from 'react';
import { RequiredBy } from '../../../types/global';
import {
  Method,
  request,
  RequestOptions,
  RequestOptionsWithDomain,
  RequestOptionsWithOptionalDomain,
} from '../../../utils/api';
import { createCacheKey, getCache } from '../../../utils/cache';
import { requestLog } from '../../../utils/log';
import { Query as QueryType } from '../../../utils/util';
import {
  TotalProgress,
  totalProgressInitialiser,
} from '../../../utils/xhr/progress';
import ErrorBoundary from '../ErrorBoundary';
import { useQueryOptions } from '../QueryOptionsProvider';

export type DataHandler<T> = (data: T) => any;

interface QueryParams<T = any> {
  query: string;
  delay?: number;
  onRead?: DataHandler<T>;
  requestOptions?: RequestOptionsWithOptionalDomain;
  useConfig?: boolean;
  disable?: boolean;
  cache?: number;
  method?: Method;
  data?: any;
}

interface QueryReturn<T> {
  data: T;
  loading: TotalProgress | boolean;
  error?: string;
  fetching: TotalProgress | boolean;
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
  disable = query == null,
  cache: queryCache,
  method = 'GET',
  data,
}: QueryParams<T>): QueryReturn<T> => {
  // The default data/load/error triple
  const [dataResolver, setDataResolver] = useState<QueryType>({
    data: undefined,
    loading: totalProgressInitialiser(),
    error: undefined,
    fetching: totalProgressInitialiser(),
  });
  const forceRefresh = () => setRefresh(!refresh);
  const manualUpdate = useCallback(
    (data: T) =>
      setDataResolver({
        ...dataResolver,
        data,
        loading: false,
        error: undefined,
      }),
    []
  );

  if (disable) return { ...dataResolver, forceRefresh, manualUpdate };

  const options = Object.merge<
    any,
    RequiredBy<RequestOptionsWithDomain, 'mode' | 'verbosity'>
  >(useQueryOptions()[0], requestOptions);

  const { domain, mode, verbosity, cache: cacheOption } = options;

  const cache = queryCache ?? cacheOption;
  const cacheHash = cache != 0 ? createCacheKey(query, data) : '';

  const req = (path: string, options?: RequestOptions) =>
    request(domain, path, options);

  const [controller, setController] = useState<AbortController>();
  const [refresh, setRefresh] = useState(false);

  // Check if the query prop has changed
  useEffect(() => {
    requestLog(
      mode,
      verbosity,
      8,
      `[read][${method}]`,
      `${domain}/${query}`,
      data ?? ''
    );
    controller?.abort();
    const ctrl = new AbortController();
    const timeout = window.setTimeout(() => {
      const { signal, ...others } = options;
      req(query, {
        signal: ctrl.signal,
        cache,
        ...others,
        method,
        data,
      })
        .then((res) => {
          if (res != undefined) {
            setDataResolver({
              data: res,
              loading: false,
              error: undefined,
              fetching: false,
            });
            onRead?.(res);
          }
        })
        .catch((err) => {
          setDataResolver({
            data: undefined,
            loading: false,
            error: err.statusText,
            fetching: false,
          });
        });
    }, delay ?? 0);
    setController(ctrl);

    const cacheData = getCache(cacheHash);

    setDataResolver({
      data: cacheData,
      loading: cacheData == undefined,
      error: undefined,
      fetching: true,
    });

    return () => {
      ctrl?.abort();
      window.clearTimeout(timeout);
    };
  }, [query, refresh, data]);

  return {
    ...dataResolver,
    manualUpdate,
    forceRefresh,
  };
};

/**
 * The query component is a fetch wrapper that allows to directly add logic in the design of the react DOM architecture
 */
export const Query: <T = any>(
  p: QueryProps<T>
) => React.ReactElement<QueryProps<T>> = ({ children, ...qRest }) => {
  const [{ loader }] = useQueryOptions();
  const { loading, ...qData } = useQuery(qRest);

  // Always call to maintain the hooks
  const render = children({ loading, ...qData });

  return (
    <ErrorBoundary>
      {loading && loader && loader.autoload ? (
        <>{loader.loader ?? <div>Loading data...</div>}</>
      ) : (
        render
      )}
    </ErrorBoundary>
  );
};
