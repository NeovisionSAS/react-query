import { Mode } from '../../../types/global';
import { GetHeaders, Method } from '../../../utils/api';
import { requestLog } from '../../../utils/log';
import { Query as QueryType } from '../../../utils/util';
import ErrorBoundary from '../ErrorBoundary';
import { DataHandler, Query } from '../Query';
import { useQueryOptions } from '../QueryOptionsProvider';
import { CreateParams, createRequest } from './create';
import { DeleteParams, deleteRequest } from './delete';
import { UpdateParams, updateRequest } from './update';
import React, { FormEvent, useEffect } from 'react';

interface CRUDProps<T> {
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
  endPoints: Endpoints;
  /**
   * Callback function whenever the component finished creating the object
   */
  onCreated?: () => any;
  /**
   * Callback function whenever the component finished reading the object
   */
  onRead?: (data: T) => any;
  /**
   * Callback function whenever the component finished updating the object
   */
  onUpdated?: () => boolean | any;
  /**
   * Callback function whenever the component finished deleting the object
   */
  onDeleted?: () => any;
  /**
   * Add a `delay` before the request is sent.
   * Very useful to test whenever you need to show some loading.
   */
  delay?: number;
}

export type Endpoints =
  | { create?: string; read?: string; update?: string; delete?: string }
  | string;

export type SetType = 'array' | 'item';

interface GeneralParams {
  method: Method;
}

export interface IdentifiableGeneralParams extends GeneralParams {
  name?: string;
}

export type PartialIdentifiableGeneralParams =
  Partial<IdentifiableGeneralParams>;
export type PartialGeneralParams = Partial<GeneralParams>;

type FormRequest<T extends PartialIdentifiableGeneralParams> = (
  e: FormEvent,
  params?: T
) => Promise<any>;

export interface FormRequestParams<T> {
  endpoint: string;
  mode: Mode;
  verbosity: number;
  domain: string;
  manualUpdate: DataHandler<T>;
  data?: T;
  headers?: GetHeaders;
  onCompleted?: () => any;
  forceRefresh: () => any;
}

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
export interface CRUDObject<T> {
  handleCreate: FormRequest<CreateParams>;
  read: QueryType<T>;
  handleUpdate: FormRequest<UpdateParams>;
  /**
   * The Form handler to process deleting an item
   * @param {DeleteParams} params The params object takes :
   *
   * - id : The `id` value that represents the object in the database
   * - name : The name of the key associated with the `id` value
   * - method : The method used for the request
   * - pathTail : What to put at the end of the request
   */
  handleDelete: (e: FormEvent, params?: DeleteParams) => Promise<any>;
}

/**
 * This component is used to simplify `CRUD` operations.
 * You give it the `endpoint(s)` to which you want to do requests and it will handle
 * all of the tasks in the background and update the state of the variables
 * it gives you from the child function.
 *
 * Make sure to define the QueryOptions param with the `QueryOptionsProvider` component
 *
 * Go to the [examples directory](https://bitbucket.org/neovision/react-query/src/master/src/examples) to see examples
 */
export const CRUD = <T = any,>({
  children,
  endPoints,
  onCreated,
  onRead,
  onUpdated,
  onDeleted,
  delay,
}: CRUDProps<T>): React.ReactElement<CRUDProps<T>> => {
  const [createEndpoint, readEndpoint, updateEndpoint, deleteEndpoint] =
    typeof endPoints == 'string'
      ? new Array(4).fill(endPoints)
      : [endPoints.create, endPoints.read, endPoints.update, endPoints.delete];

  const [queryOptionsState] = useQueryOptions();
  const { verbosity, mode } = queryOptionsState;

  useEffect(() => {
    requestLog(
      mode,
      verbosity,
      5,
      `[endpoints]`,
      `[C]${createEndpoint ?? ''}`,
      `[R]${readEndpoint ?? ''}`,
      `[U]${updateEndpoint ?? ''}`,
      `[D]${deleteEndpoint ?? ''}`
    );
  }, [createEndpoint, readEndpoint, updateEndpoint, deleteEndpoint]);

  return (
    <ErrorBoundary>
      <Query<T> query={readEndpoint} delay={delay} onRead={onRead}>
        {(res) => {
          const { forceRefresh } = res;
          const type: SetType = Array.isArray(res.data) ? 'array' : 'item';
          return (
            <>
              {children(
                {
                  handleCreate: createRequest({
                    endpoint: createEndpoint,
                    onCompleted: onCreated,
                    ...queryOptionsState,
                    ...res,
                  }),
                  read: res,
                  handleUpdate: updateRequest({
                    endpoint: updateEndpoint,
                    onCompleted: onUpdated,
                    type,
                    ...queryOptionsState,
                    ...res,
                  }),
                  handleDelete: deleteRequest({
                    endpoint: deleteEndpoint,
                    type,
                    onCompleted: onDeleted,
                    ...queryOptionsState,
                    ...res,
                  }),
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
