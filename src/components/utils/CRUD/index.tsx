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
import React, { FormEvent, Fragment, useEffect } from 'react';

interface CRUDProps<T = any> {
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
  endPoints:
    | { create?: string; read: string; update?: string; delete?: string }
    | string;
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
  /**
   * Weither the element you are pointing to in the backend refers to an `array`
   * of elements or siply to an `item`
   */
  type?: SetType;
}

export type SetType = 'array' | 'item';

interface GeneralParams {
  pathTail?: string | number;
  method: Method;
}

export interface IdentifiableParams extends GeneralParams {
  name?: string;
}

export type PartialIdentifiableParams = Partial<IdentifiableParams>;

type FormRequest<T extends PartialIdentifiableParams> = (
  e: FormEvent,
  params?: T
) => Promise<any>;

export interface FormRequestParams<T = any> {
  endpoint: string;
  mode: Mode;
  verbosity: number;
  domain: string;
  manualUpdate: DataHandler<T>;
  data: T;
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
export interface CRUDObject<T = any> {
  handleCreate: FormRequest<CreateParams>;
  read: QueryType<T>;
  handleUpdate: FormRequest<UpdateParams>;
  handleDelete: (
    e: FormEvent | undefined,
    params?: DeleteParams
  ) => Promise<any>;
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
const CRUD: <T = any>(p: CRUDProps<T>) => React.ReactElement<CRUDProps<T>> = ({
  children,
  endPoints,
  onCreated,
  onRead,
  onUpdated,
  onDeleted,
  delay,
  type = 'array',
}) => {
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
      `[C]${createEndpoint}`,
      `[R]${readEndpoint}`,
      `[U]${updateEndpoint}`,
      `[D]${deleteEndpoint}`
    );
  }, [createEndpoint, readEndpoint, updateEndpoint, deleteEndpoint]);

  return (
    <ErrorBoundary>
      <Query query={`${readEndpoint}`} delay={delay} onRead={onRead}>
        {(res) => {
          const { forceRefresh } = res;
          return (
            <Fragment>
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
            </Fragment>
          );
        }}
      </Query>
    </ErrorBoundary>
  );
};

export default CRUD;
