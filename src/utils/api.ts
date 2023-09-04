import { PartialBy, RequiredBy } from "../types/global";
import { createCacheKey, setCache } from "./cache";
import { requestError, requestWarn } from "./log";
import { buildHeader, restructureData } from "./util";
import { XHRFetch } from "./xhr";
import { XHRProgress } from "./xhr/progress";
import { FormEvent } from "react";

/**
 * HTTP Methods
 */
export type Method = "POST" | "PUT" | "PATCH" | "DELETE" | "GET";
/**
 * Indiciation of where the `id` of the item being fetch/modified should be
 * Either in the `path` or in the `queryString`
 * @example
 * `path` => 'https://domain/item/1'
 * `queryString` => 'https://domain/item?id_name=1'
 */
export type QueryParamType = "path" | "queryString" | "none";

/**
 * Loader options for when data is being loaded
 */
interface LoaderOptions {
  /**
   * The JSX.Element being used as a loader
   */
  loader?: JSX.Element;
  /**
   * `autoload` is if autoloading is on. If on then there
   * will be a default loader. Thus the function hook only receives
   * the data when it is available
   */
  autoload?: boolean;
}

/**
 * Promise for retrieving the HTTP Headers
 */
export type GetHeaders = () => Promise<HeadersInit>;

/**
 * Weither we are in development mode or in production mode
 *
 * `development` makes it so that logging is possible
 *
 * `production` makes it so that logging is impossible
 */
export type EnvMode = "development" | "production";

/**
 * The base of all queries sent to the server
 */
export interface BaseQueryOptions extends Rejectable, Cacheable {
  /**
   * See `GetHeaders`
   */
  headers?: GetHeaders;
  /**
   * See `QueryParamType`
   */
  parameterType?: QueryParamType;
  /**
   * See `EnvMode`
   */
  mode?: EnvMode;
  /**
   * The verbosity level being used
   */
  verbosity?: number;
  /**
   * The name of the attribute used to uniquely identify the data.
   * Usually this is the name of the `primary key`
   */
  idName?: string;
  /**
   * Add a `delay` before the request is sent.
   * Very useful to test whenever you need to show some loading.
   */
  delay?: number;
}

export interface Rejectable {
  onRejected?: (rej: Reject) => any;
}

export interface Reject<T = any> {
  status: number;
  statusText: string;
  url: string;
  data: T;
}

export type RequestData = object | string | FormEvent | FormData;

export interface RequestOptions extends BaseQueryOptions {
  method?: Method;
  data?: RequestData;
  signal?: AbortSignal;
  progress?: XHRProgress;
  responseType?: XMLHttpRequestResponseType;
}

interface Domain {
  domain: string;
}

/**
 * Allows to implement the `cache` attribute
 */
interface Cacheable {
  /**
   * Weither to store the request data or not.
   *
   * When `0`, no caching is done.
   * By default caching is enabled and set to `300ms`
   */
  cache?: number;
}

/**
 * Component query options used to set parameters for the underlying request
 */
export interface QueryOptions
  extends BaseQueryOptions,
    Domain,
    Cacheable,
    Loadable {}

export interface Loadable {
  /**
   * A loadable element loader should have options or be set to a boolean
   */
  loader?: LoaderOptions | boolean;
}

/**
 * Advanced QueryOptions adding some requirements to the initial Query
 * `mode`, `verbosity`, `parameterType` and `idName` are required
 */
export type RealQueryOptions = RequiredBy<
  QueryOptions,
  "mode" | "verbosity" | "parameterType" | "idName"
>;

/**
 * Type identifying request Options and the requirement to add a domain and be cachable
 */
export type RequestOptionsWithDomain = RequestOptions & Domain & Cacheable;

/**
 * Same as `RequestOptionsWithDomain` but `domain` is not required
 */
export type RequestOptionsWithOptionalDomain = PartialBy<
  RequestOptionsWithDomain,
  "domain"
>;

/**
 * Merge request options together. The right most objects in the array override the elements to the left
 * @param options RequestOptions
 * @param override weither we should override the data or try to merge it. For example a function in the params might want to still be called. Thus we would need to merge it with our new one
 * @returns T
 *
 * @example
 * requestOptionsMerge({method: "GET"}, {method: "POST"})
 * // {method: "POST"}
 * const options = requestOptionsMerge(
 *    {onRejected: () => console.log("hey")},
 *    {onRejected: () => console.log("bye")}
 * )
 * options.onRejected()
 * // hey
 * // bye
 */
export const requestOptionsMerge = <T extends RequestOptions = RequestOptions>(
  options: RequestOptions[],
  override = false
): T => {
  if (override) return Object.merge(...options);
  return Object.merge(...options, {
    onRejected: (rej) => options.forEach((o) => o.onRejected?.(rej)),
  });
};

/**
 * The underlying request object used to iteract with the server
 * @param domain Domain name used
 * @param path The path after the domain where the data can be retrieved
 * @param options The request options
 * @returns A Promise with the data
 *
 * @example
 * request("https://google.fr", "/apî/users/1", {method:"GET"})
 */
export const request = function <T = any>(
  domain: string,
  path: string,
  options: RequestOptions = {
    method: "GET",
  }
): Promise<T> {
  const {
    method = "GET",
    headers,
    mode = "production",
    onRejected,
    data,
    cache,
    ...rest
  } = options;
  const { body, contentType } = restructureData(data);

  const req = (headers: HeadersInit) => {
    const endpoint = `${domain}/${path}`;
    const cacheHash = cache != 0 ? createCacheKey(path, data) : "";
    return XHRFetch(endpoint, {
      headers: buildHeader(headers, contentType),
      method,
      body,
      ...rest,
    })
      .then((res) => {
        setCache(cacheHash, res, cache);
        return res;
      })
      .catch((err) => {
        if (err.name == "AbortError") requestWarn(mode, 0, 0, err.message);
        else {
          requestError(method, endpoint, `${err.status} ${err.statusText}`);
          onRejected?.(err);
          throw err;
        }
      });
  };

  return headers ? headers().then(req) : req({});
};

/**
 * A way to know what to do with the LoaderOptions being passed
 *
 * No loader means no autoloading. If loader is set to be a boolean, then autoloading is active. Autoloading is active if explicitly set to true
 *
 * @param loader
 * @returns LoaderOptions
 */
export const parseLoader = (
  loader?: LoaderOptions | boolean
): LoaderOptions => {
  if (loader == undefined) return {};
  if (typeof loader == "boolean") return { autoload: true };
  return loader;
};
