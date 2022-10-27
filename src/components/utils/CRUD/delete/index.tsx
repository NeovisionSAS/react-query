import { FormEvent } from 'react';
import {
  FormRequestParams,
  PartialIdentifiableGeneralParams,
  SetType,
} from '..';
import { request, requestOptionsMerge } from '../../../../utils/api';
import { setCache } from '../../../../utils/cache';
import { requestError, requestLog } from '../../../../utils/log';
import { getFormData } from '../../../../utils/util';

interface DeleteFormRequestParams<T = any> extends FormRequestParams<T> {
  type: SetType;
}

export interface DeleteParams extends PartialIdentifiableGeneralParams {
  id?: number | string;
}

export const deleteRequest = ({
  data,
  endpoint: {
    endpoint,
    domain,
    idName,
    verbosity,
    parameterType,
    mode,
    ...eRest
  },
  forceRefresh,
  manualUpdate,
  headers,
  onCompleted: onDeleted,
  type,
  cacheKey,
}: DeleteFormRequestParams) => {
  return (
    e: FormEvent | undefined,
    params: DeleteParams = { method: 'DELETE', name: idName }
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    const formData = e && getFormData(e.target);

    const {
      method = 'DELETE',
      name = idName,
      id = formData?.[name],
      onRejected,
    } = requestOptionsMerge<DeleteParams>([eRest, params]);

    const endpointId = `${endpoint}/${parameterType == 'path' ? `${id}/` : ''}`;

    requestLog(
      mode,
      verbosity,
      1,
      `[delete][${method}]`,
      `${domain}/${endpointId}`
    );

    const sendData = parameterType == 'path' ? '' : formData ?? '';

    return request(domain, endpointId, {
      method,
      headers,
      mode,
      data: sendData,
      onRejected,
    }).then(() => {
      if (type == 'array') {
        const index = (data as unknown as any[]).findIndex(
          (val) => val[name] == id
        );
        if (index < 0) {
          requestError(`Element with ${name} ${id} not found.`);
          throw new Error(`Element with ${name} ${id} not found.`);
        }
        const typedData = data as unknown as any[];
        requestLog(
          mode,
          verbosity,
          8,
          `Removing index ${index} matching ${name} ${id}`
        );
        const newArr = [
          ...typedData.slice(0, index),
          ...typedData.slice(index + 1, typedData.length),
        ];
        requestLog(mode, verbosity, 4, `Array updated`, newArr);
        manualUpdate?.(newArr as any);
        setCache(cacheKey, newArr);
      } else {
        manualUpdate?.(data as any);
      }
      onDeleted?.() && forceRefresh?.();
    });
  };
};
