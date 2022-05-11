import { Method, request } from '../../../utils/api';
import { requestLog } from '../../../utils/log';
import {
  formExtractor,
  getFormData,
  getPathTail,
  Query as QueryType,
} from '../../../utils/util';
import ErrorBoundary from '../ErrorBoundary';
import Query from '../Query';
import { useQueryOptions } from '../QueryOptionsProvider';
import equal from 'fast-deep-equal';
import React, { FormEvent, Fragment, SyntheticEvent, useEffect } from 'react';

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
  type?: 'array' | 'item';
}

interface GeneralParams {
  pathTail?: string | number;
  method: Method;
}

interface IdentifiableParams extends GeneralParams {
  name?: string;
}

interface UpdateParams extends Partial<IdentifiableParams> {
  name?: string;
}

type CreateParams = Partial<IdentifiableParams>;

interface DeleteParams extends Partial<IdentifiableParams> {
  id?: number | string;
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
  handleCreate: <T>(e: FormEvent, params?: CreateParams) => Promise<any>;
  read: QueryType<T>;
  handleUpdate: <T>(e: FormEvent, params?: UpdateParams) => Promise<any>;
  handleDelete: <T>(
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

  const { parameterType, domain, requestMiddleware, mode, verbosity, idName } =
    useQueryOptions();

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
        {(data: any, loading, error, manualUpdate, queryRefresh) => {
          return (
            <Fragment>
              {children(
                {
                  handleCreate: <T,>(
                    e: FormEvent,
                    params: CreateParams = { method: 'POST' }
                  ) => {
                    e.preventDefault();
                    const { method = 'POST', pathTail } = params;
                    const formData = getFormData(e.target);

                    const endpoint = `${createEndpoint}/${
                      pathTail ? `${pathTail}/` : ''
                    }`;

                    requestLog(
                      mode,
                      verbosity,
                      1,
                      `[create][${method}]`,
                      `${domain}/${endpoint}`,
                      formData
                    );

                    return request(domain, endpoint, {
                      body: JSON.stringify(formData),
                      method,
                      headers: requestMiddleware?.(),
                      mode,
                    })
                      .then((created) => {
                        manualUpdate?.([...(data as any), created] as any);
                        onCreated?.() && queryRefresh?.();
                      })
                      .catch(() => {
                        console.error(
                          `Erreur de création`,
                          `Une erreur est survenu lors de la création dans la base de données`
                        );
                      });
                  },
                  read: { data, loading, error },
                  handleUpdate: <T,>(
                    e: FormEvent,
                    params: UpdateParams = { method: 'PUT', name: idName }
                  ) => {
                    e.preventDefault();
                    const { method = 'PUT', pathTail, name = idName } = params;

                    const formDatas = formExtractor(e.target, name!);

                    let newData: any;
                    if (type == 'array') newData = [...(data as any[])];
                    else newData = data;

                    const promises: Promise<any>[] = [];
                    formDatas.forEach((formData) => {
                      const tail = getPathTail(
                        formData,
                        parameterType,
                        name!,
                        pathTail
                      );

                      const endpoint = `${updateEndpoint}/${
                        tail ? `${tail}/` : ''
                      }`;

                      let hasChanged = false;
                      if (type == 'array') {
                        const index = (newData as any[]).findIndex(
                          (val) => val[name!] == tail
                        );
                        if (index != undefined) {
                          const mergedData = {
                            ...newData[index],
                            ...formData,
                          };
                          hasChanged = !equal(newData[index], mergedData);
                          newData[index] = mergedData;
                        } else newData.push(formData);
                      } else {
                        hasChanged = !equal(newData, data);
                        newData = { ...newData, ...formData };
                      }

                      if (hasChanged) {
                        requestLog(
                          mode,
                          verbosity,
                          1,
                          `[update][${method}]`,
                          `${domain}/${endpoint}`,
                          formData
                        );
                        promises.push(
                          request(domain, endpoint, {
                            body: JSON.stringify(formData),
                            method,
                            headers: requestMiddleware?.(),
                            mode,
                          })
                        );
                      }
                    });
                    return Promise.all(promises).then(() => {
                      manualUpdate?.(newData as any);
                      onUpdated?.() && queryRefresh?.();
                    });
                  },
                  handleDelete: <T,>(
                    e: SyntheticEvent | undefined,
                    params: DeleteParams = { method: 'DELETE', name: idName }
                  ) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    const {
                      method = 'DELETE',
                      pathTail,
                      name = idName,
                      id,
                    } = params;

                    const tail = getPathTail(
                      { [name]: id!.toString() },
                      parameterType,
                      name,
                      pathTail
                    );

                    const endpoint = `${deleteEndpoint}/${tail}/`;

                    requestLog(
                      mode,
                      verbosity,
                      1,
                      `[delete][${method}]`,
                      `${domain}/${endpoint}`
                    );

                    return request(domain, endpoint, {
                      method,
                      headers: requestMiddleware?.(),
                      mode,
                    }).then(() => {
                      if (type == 'array') {
                        const index = (data as any[]).findIndex(
                          (val) => val[name] == id
                        );
                        const typedData = data as unknown as any[];
                        requestLog(
                          mode,
                          verbosity,
                          3,
                          `Removing index ${index}`
                        );
                        const newArr = [
                          ...typedData.slice(0, index),
                          ...typedData.slice(index + 1, typedData.length),
                        ];
                        requestLog(mode, verbosity, 4, `Array updated`, newArr);
                        manualUpdate?.(newArr as any);
                      } else {
                        manualUpdate?.(data as any);
                      }
                      onDeleted?.() && queryRefresh?.();
                    });
                  },
                },
                queryRefresh
              )}
            </Fragment>
          );
        }}
      </Query>
    </ErrorBoundary>
  );
};

export default CRUD;
