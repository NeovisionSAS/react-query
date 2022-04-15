import React, { FormEvent, Fragment, SyntheticEvent, useEffect } from 'react';
import { Method, setData } from '../../../utils/api';
import { queryLog } from '../../../utils/log';
import { getFormData, Query as QueryType } from '../../../utils/util';
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
  id?: number;
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
      ? new Array(4).fill(endPoints, 0, -1)
      : [endPoints.create, endPoints.read, endPoints.update, endPoints.delete];

  const { parameterType, domain, requestMiddleware, mode } = useQueryOptions();

  useEffect(() => {
    if (mode == 'development')
      queryLog(
        `[endpoints]`,
        createEndpoint,
        readEndpoint,
        updateEndpoint,
        deleteEndpoint
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
                    const formData = getFormData<T>(e.target);
                    if (mode == 'development')
                      queryLog(`[create][${method}]`, formData);

                    return setData(
                      domain,
                      `${createEndpoint}/${pathTail ? `${pathTail}/` : ''}`,
                      {
                        body: JSON.stringify(formData),
                        method,
                        middleware: requestMiddleware?.(),
                      }
                    )
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
                    const formData = getFormData<T>(e.target);

                    const id = (formData as any)[name!];

                    let tail;
                    if (parameterType == 'path' && id != '' && id != null) {
                      tail = id;
                      delete (formData as any)[name!];
                    } else tail = pathTail;

                    if (mode == 'development')
                      queryLog(`[update][${method}]`, formData);

                    return setData(
                      domain,
                      `${updateEndpoint}/${tail ? `${tail}/` : ''}`,
                      {
                        body: JSON.stringify(formData),
                        method,
                        middleware: requestMiddleware?.(),
                      }
                    ).then(() => {
                      let newData;
                      if (type == 'array') {
                        const index = (data as any[]).findIndex(
                          (val) => val[name!] == id
                        );
                        newData = [...(data as any[])];
                        if (index != undefined)
                          newData[index] = { ...newData[index], ...formData };
                        else newData.push(formData);
                      } else {
                        newData = data;
                      }
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
                    if (mode == 'development')
                      queryLog(`[delete][${realMethod}]`);

                    let tail;
                    if (parameterType == 'path' && id != null) tail = id;
                    else tail = pathTail;

                    return setData(domain, `${deleteEndpoint}/${tail}/`, {
                      method: realMethod,
                    }).then(() => {
                      if (type == 'array') {
                        const index = (data as any[]).findIndex(
                          (val) => val[name!] == id
                        );
                        const typedData = data as unknown as any[];
                        manualUpdate?.([
                          ...typedData.slice(0, index),
                          ...typedData.slice(index + 1, typedData.length),
                        ] as any);
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
