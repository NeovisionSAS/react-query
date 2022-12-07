import { useCallback, useEffect, useState } from 'react';
import { useQueryOptions } from '../../components/utils/QueryOptionsProvider';
import { RequiredBy } from '../../types/global';
import {
  request,
  RequestOptions,
  requestOptionsMerge,
  RequestOptionsWithDomain,
  RequestOptionsWithOptionalDomain,
} from '../../utils/api';
import { createCacheKey, getCache } from '../../utils/cache';
import { requestLog } from '../../utils/log';
import { Query as QueryType } from '../../utils/util';
import {
  TotalProgress,
  totalProgressInitialiser,
} from '../../utils/xhr/progress';

export type DataHandler<T> = (data: T) => any;

export interface RequestQueryEvents<T> {
  /**
   * Callback function whenever the component finished reading the object
   */
  onRead?: DataHandler<T>;
}

export interface QueryParams<T = any> extends RequestOptionsWithOptionalDomain {
  override?: boolean;
  disable?: boolean;
  data?: any;
  effect?: any[];
  active?: boolean;
}

export interface QueryHookParams<T = any>
  extends QueryParams<T>,
    RequestQueryEvents<T> {
  query: string;
}

export interface QueryReturn<T> {
  data: T;
  loading: TotalProgress | boolean;
  error?: string;
  fetching: TotalProgress | boolean;
  manualUpdate: DataHandler<T>;
  forceRefresh: () => any;
}

export const useQuery = <T = any,>({
  query,
  delay,
  onRead,
  disable = query == null,
  cache: queryCache,
  data,
  override = false,
  effect = [],
  active = true,
  ...queryOptions
}: QueryHookParams<T>): QueryReturn<T> => {
  // The default data/load/error triple
  const [dataResolver, setDataResolver] = useState<QueryType>({
    data: undefined,
    loading: totalProgressInitialiser(),
    error: undefined,
    fetching: totalProgressInitialiser(),
  });

  const [refresh, setRefresh] = useState(false);
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

  const options = requestOptionsMerge<
    RequiredBy<RequestOptionsWithDomain, 'mode' | 'verbosity'>
  >([useQueryOptions()[0], queryOptions], override);

  const { domain, mode, verbosity, cache: cacheOption, method } = options;

  const cache = queryCache ?? cacheOption;
  const cacheHash = cache != 0 ? createCacheKey(query, data) : '';

  const req = (path: string, options?: RequestOptions) =>
    request(domain, path, options);

  const [controller, setController] = useState<AbortController>();

  // Check if the query prop has changed
  useEffect(() => {
    if (!!active) {
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
      const cacheData = getCache(cacheHash);
      const timeout = window.setTimeout(() => {
        const { signal, ...others } = options;

        req(query, {
          signal: ctrl.signal,
          cache,
          ...others,
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
    }
  }, [query, refresh, data, !!active, ...effect]);

  return {
    ...dataResolver,
    manualUpdate,
    forceRefresh,
  };
};
