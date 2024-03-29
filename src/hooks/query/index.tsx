import { useQueryOptions } from "../../components/utils/QueryOptionsProvider";
import { RequiredBy } from "../../types/global";
import {
  RequestOptions,
  RequestOptionsWithDomain,
  RequestOptionsWithOptionalDomain,
  request,
  requestOptionsMerge,
} from "../../utils/api";
import { createCacheKey, getCache } from "../../utils/cache";
import { requestLog } from "../../utils/log";
import { Query as QueryType } from "../../utils/util";
import {
  TotalProgress,
  totalProgressInitialiser,
} from "../../utils/xhr/progress";
import { useCallback, useEffect, useState } from "react";

/**
 * Function with the data param of the wanted type
 */
export type DataHandler<T> = (data: T) => any;

/**
 * Interface for whenever we are requesting data to be read
 */
export interface RequestQueryEvents<T> {
  /**
   * Callback function whenever the component finished reading the object
   */
  onRead?: DataHandler<T>;
}

/**
 * Query params for a component
 */
export interface QueryParams<T = any> extends RequestOptionsWithOptionalDomain {
  override?: boolean;
  /**
   * Weither the component should be disabled. If disabled the request never gets sent.
   */
  disable?: boolean;
  /**
   * The data object containing data if it exists
   */
  data?: any;
  /**
   * The useEffect elements to be used in case a change occurs
   */
  effect?: any[];
  /**
   * Use the current data in cache while fetching.
   * After fetch is done, the data is actualized
   */
  memoizedLoading?: boolean;
  /**
   * Same as ignore but kept for backwards compatibility
   */
  active?: boolean;
  /**
   * The request is ignored and hook function gets called
   */
  ignore?: boolean;
  /**
   * The date format to use. Null considers the date as a string
   */
  dateFormat?: "string" | "iso";
}

/**
 * The params along with the `query` attribute to send.
 */
export interface QueryHookParams<T = any>
  extends QueryParams<T>,
    RequestQueryEvents<T> {
  query: string;
}

/**
 * The returned elements to dispose to the user
 */
export interface QueryReturn<T> {
  data: T;
  loading: TotalProgress | boolean;
  error?: string;
  fetching: TotalProgress | boolean;
  manualUpdate: DataHandler<T>;
  forceRefresh: () => any;
}

/**
 * Hook to interact with the server in a react way.
 *
 * Data to dispose to the user is stored in react stats.
 *
 * Effect hooks are used to know when to update the request
 *
 * @param QueryHookParams
 * @returns QueryReturn
 */
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
  memoizedLoading = false,
  ignore = false,
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
    RequiredBy<RequestOptionsWithDomain, "mode" | "verbosity">
  >([useQueryOptions()[0], queryOptions], override);

  const { domain, mode, verbosity, cache: cacheOption, method } = options;

  const cache = queryCache ?? cacheOption;
  const cacheHash = cache != 0 ? createCacheKey(query, data) : "";

  const req = (path: string, options?: RequestOptions) =>
    request(domain, path, options);

  const [controller, setController] = useState<AbortController>();

  // Check if the query prop has changed
  useEffect(() => {
    if (!!active && !ignore) {
      requestLog(
        mode,
        verbosity,
        8,
        `[read][${method}]`,
        `${domain}/${query}`,
        data ?? ""
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

      if (!memoizedLoading || dataResolver.data == undefined)
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
    if (ignore) {
      setDataResolver({
        data: undefined,
        fetching: false,
        loading: false,
        error: undefined,
      });
    }
  }, [query, refresh, data, !!active, ignore, ...effect]);

  return {
    ...dataResolver,
    manualUpdate,
    forceRefresh,
  };
};
