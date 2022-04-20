import equal from 'fast-deep-equal';
import React, { FormEvent, Fragment, SyntheticEvent, useEffect } from 'react';
import { Method, setData } from '../../../utils/api';
import { queryLog } from '../../../utils/log';
import {
  formExtractor,
  getFormData,
  getPathTail,
  Query as QueryType,
} from '../../../utils/util';
import ErrorBoundary from '../ErrorBoundary';
import Query from '../Query';
import { useQueryOptions } from '../QueryOptionsProvider';

interface CRUDProps<T = any> {
  children: (object: CRUDObject<T>, forceRefresh: () => void) => JSX.Element;
  endPoints:
    | { create?: string; read: string; update?: string; delete?: string }
    | string;
  onCreated?: () => any;
  onRead?: (data: T) => any;
  onUpdated?: () => boolean | any;
  onDeleted?: () => any;
  delay?: number;
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

export interface CRUDObject<T = any> {
  handleCreate: <T>(e: FormEvent, params?: CreateParams) => Promise<any>;
  read: QueryType<T>;
  handleUpdate: <T>(e: FormEvent, params?: UpdateParams) => Promise<any>;
  handleDelete: <T>(
    e: FormEvent | undefined,
    params: DeleteParams
  ) => Promise<any>;
}

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

  const { parameterType, domain, requestMiddleware, mode, verbosity } =
    useQueryOptions();

  useEffect(() => {
    queryLog(
      mode,
      verbosity,
      4,
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
                    const { method, pathTail } = params;
                    const formData = getFormData(e.target);

                    const endpoint = `${createEndpoint}/${
                      pathTail ? `${pathTail}/` : ''
                    }`;

                    queryLog(
                      mode,
                      verbosity,
                      1,
                      `[create][${method}]`,
                      `${domain}/${endpoint}`,
                      formData
                    );

                    return setData(domain, endpoint, {
                      body: JSON.stringify(formData),
                      method,
                      middleware: requestMiddleware?.(),
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
                    params: UpdateParams = { method: 'PUT', name: 'id' }
                  ) => {
                    e.preventDefault();
                    const { method, pathTail, name } = params;

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
                        queryLog(
                          mode,
                          verbosity,
                          1,
                          `[update][${method}]`,
                          `${domain}/${endpoint}`,
                          formData
                        );
                        promises.push(
                          setData(domain, endpoint, {
                            body: JSON.stringify(formData),
                            method,
                            middleware: requestMiddleware?.(),
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
                    params: DeleteParams = { method: 'DELETE' }
                  ) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    const { method, pathTail, name, id } = params;
                    const realMethod = method ?? 'DELETE';

                    const tail = getPathTail(
                      { [name!]: id!.toString() },
                      parameterType,
                      name!,
                      pathTail
                    );

                    const endpoint = `${deleteEndpoint}/${tail}/`;

                    queryLog(
                      mode,
                      verbosity,
                      1,
                      `[delete][${realMethod}]`,
                      `${domain}/${endpoint}`
                    );

                    return setData(domain, endpoint, {
                      method: realMethod,
                      middleware: requestMiddleware?.(),
                      mode,
                    }).then(() => {
                      if (type == 'array') {
                        const index = (data as any[]).findIndex(
                          (val) => val[name!] == id
                        );
                        const typedData = data as unknown as any[];
                        queryLog(mode, verbosity, 3, `Removing index ${index}`);
                        const newArr = [
                          ...typedData.slice(0, index),
                          ...typedData.slice(index + 1, typedData.length),
                        ];
                        queryLog(mode, verbosity, 4, `Array updated`, newArr);
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
