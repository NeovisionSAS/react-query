import { DataHandler, QueryParams, QueryReturn } from "../../../hooks/query";
import { Method, Rejectable, requestOptionsMerge } from "../../../utils/api";
import { createCacheKey } from "../../../utils/cache";
import { requestLog } from "../../../utils/log";
import { Query as QueryType } from "../../../utils/util";
import ErrorBoundary from "../ErrorBoundary";
import { Query } from "../Query";
import { useQueryOptions } from "../QueryOptionsProvider";
import { CreateParams, createRequest } from "./create";
import { DeleteParams, deleteRequest } from "./delete";
import { UpdateParams, updateRequest } from "./update";
import objectHash from "object-hash";
import React, { FormEvent, useEffect, useMemo } from "react";

interface CRUDProps<T extends object> extends QueryParams<T> {
  /**
   * This function is called whenever the query changes or if the state of the parameters have changed
   *
   * @param {CRUDObject} object The CRUDObject that contains all the data and function to use
   * @returns JSX.Element
   */
  children: (object: CRUDObject<T>, forceRefresh: () => void) => JSX.Element;
  /**
   * The `enpoint` to point to.
   * It can either be a `string`, thus the component will do request on that specific link.
   * You can also specify an `object` and specify where the component should request
   * for each of the `CRUD` operations
   */
  endpoints: Endpoints;
  /**
   * Callback function whenever the component finished creating the object
   */
  onCreated?: () => any;
  /**
   * Callback function whenever the component finished updating the object
   */
  onUpdated?: () => boolean | any;
  /**
   * Callback function whenever the component finished deleting the object
   */
  onDeleted?: () => any;
}

export type Endpoints =
  | {
      create: EndpointOrString;
      read: EndpointOrString;
      update: EndpointOrString;
      delete: EndpointOrString;
    }
  | string;

type EndpointOrString = string | Endpoint;

interface Endpoint extends QueryParams {
  endpoint: string;
}

export type SetType = "array" | "item";

interface GeneralParams extends Rejectable {
  method: Method;
}

export interface IdentifiableGeneralParams extends GeneralParams {
  name?: string;
}

export type PartialIdentifiableGeneralParams =
  Partial<IdentifiableGeneralParams>;
export type PartialGeneralParams = Partial<GeneralParams>;

type FormRequest<T, U extends PartialIdentifiableGeneralParams, F = T> = (
  e: CRUDEventHandler<T>,
  params?: U
) => Promise<F>;

export interface FormRequestParams<T> {
  endpoint: Required<Endpoint>;
  manualUpdate: DataHandler<T>;
  data?: T;
  onCompleted?: () => any;
  forceRefresh: () => any;
  cacheKey: string;
}

type CRUDEventHandlerObject<T> = Partial<T>;

export type CRUDEventHandler<T> = FormEvent | CRUDEventHandlerObject<T>;

/**
 * This interface is what types the object received in the children function
 * to interact with the CRUD functions automatically created by react-query
 * to make it easy to GET/POST/PUT/PATCH/DELETE
 *
 * @example-1
 * ```jsx
 *   {(data: CRUDObject<string>) => {
 *      const { read, handleCreate, handleUpdate, handleDelete } = data;
 *      if (read.loading) return <div>Loading...</div>;
 *
 *      return (
 *        <>
 *          <form onSubmit={handleCreate}></form>
 *          <form onSubmit={handleUpdate}></form>
 *          <form onSubmit={handleDelete}></form>
 *        </>
 *      );
 *    }}
 * ```
 * @example-2
 * ```jsx
 * {(data: CRUDObject<string>) => {
 *   const { read, handleUpdate } = data;
 *   if (read.loading) return <div>Loading...</div>;
 *
 *   // On submit, the form will send a PUT request
 *   // { "name": "Gerald" } to the endpoint "server/endpoint/1/"
 *   // or
 *   // { "primary_key": 1, "name": "Gerald" } to the endpoint "server/endpoint/"
 *   // Depending on the parameterType of the QueryOptionsProvider ("path" or "queryString")
 *   return (
 *     <form
 *       onSubmit={(e) =>
 *         handleUpdate(e, { method: 'PUT', name: 'primary_key' })
 *       }
 *     >
 *       <input type={`number`} name={`primary_key`} value={1} />
 *       <input name="name" value={`Gerald`} />
 *     </form>
 *   );
 * }}
 * ```
 */
export interface CRUDObject<T, U = T extends Array<infer R> ? R : T> {
  handleCreate: FormRequest<U, CreateParams>;
  read: QueryType<T>;
  handleUpdate: FormRequest<U, UpdateParams>;
  /**
   * The Form handler to process deleting an item
   * @param {DeleteParams} params The params object takes :
   *
   * - id : The `id` value that represents the object in the database
   * - name : The name of the key associated with the `id` value
   * - method : The method used for the request
   * - pathTail : What to put at the end of the request
   */
  handleDelete: FormRequest<U, DeleteParams, boolean>;
  manualUpdate: QueryReturn<T>["manualUpdate"];
}

/**
 * This component is used to simplify `CRUD` operations.
 * You give it the `endpoint(s)` to which you want to do requests and it will handle
 * all of the tasks in the background and update the state of the variables
 * it gives you from the child function.
 *
 * Make sure to define the QueryOptions param with the `QueryOptionsProvider` component
 *
 * Go to the [examples directory](https://github.com/NeovisionSAS/react-query/tree/main/src/examples) to see examples
 */
export const CRUD = <T extends object = any>({
  children,
  endpoints,
  onCreated,
  onUpdated,
  onDeleted,
  override,
  ...options
}: CRUDProps<T>): React.ReactElement<CRUDProps<T>> => {
  const endpointsHash = objectHash(endpoints);
  const [createEndpoint, readEndpoint, updateEndpoint, deleteEndpoint] =
    useMemo(() => handleEndpoints(endpoints), [endpointsHash]);

  const [queryOptionsState] = useQueryOptions();
  const queryOptions = requestOptionsMerge([queryOptionsState, options]);

  const { verbosity, mode } = queryOptionsState;

  const { data } = options;

  useEffect(() => {
    requestLog(
      mode,
      verbosity,
      5,
      `[endpoints]`,
      `[C]${createEndpoint.endpoint}`,
      `[R]${readEndpoint.endpoint}`,
      `[U]${updateEndpoint.endpoint}`,
      `[D]${deleteEndpoint.endpoint}`
    );
  }, [endpointsHash]);

  const { endpoint, ...rRest } = readEndpoint;

  return (
    <ErrorBoundary detail={mode == "development"}>
      <Query<T> query={endpoint} {...options} {...rRest}>
        {(res) => {
          const { forceRefresh } = res;
          const type: SetType = Array.isArray(res.data) ? "array" : "item";

          const cacheKey = createCacheKey(endpoint, data);

          return (
            <>
              {children(
                {
                  handleCreate: createRequest<T>({
                    endpoint: requestOptionsMerge<Required<Endpoint>>(
                      [queryOptions, createEndpoint],
                      createEndpoint.override ?? override
                    ),
                    onCompleted: onCreated,
                    cacheKey,
                    ...res,
                  }),
                  read: res,
                  handleUpdate: updateRequest({
                    endpoint: requestOptionsMerge<Required<Endpoint>>(
                      [queryOptions, updateEndpoint],
                      updateEndpoint.override ?? override
                    ),
                    onCompleted: onUpdated,
                    type,
                    cacheKey,
                    ...res,
                  }),
                  handleDelete: deleteRequest({
                    endpoint: requestOptionsMerge<Required<Endpoint>>(
                      [queryOptions, deleteEndpoint],
                      deleteEndpoint.override ?? override
                    ),
                    type,
                    cacheKey,
                    onCompleted: onDeleted,
                    ...res,
                  }),
                  manualUpdate: res.manualUpdate,
                },
                forceRefresh
              )}
            </>
          );
        }}
      </Query>
    </ErrorBoundary>
  );
};

const handleEndpoints = (endpoints: Endpoints) => {
  const endpointsOrStrings =
    typeof endpoints == "string"
      ? new Array<EndpointOrString>(4).fill(endpoints)
      : [endpoints.create, endpoints.read, endpoints.update, endpoints.delete];

  return endpointsOrStrings.map((endpointOrString) => {
    if (typeof endpointOrString == "string")
      return {
        endpoint: endpointOrString,
      };
    return endpointOrString;
  });
};
