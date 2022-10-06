import { FormEvent } from 'react';
import {
  FormRequestParams,
  PartialIdentifiableGeneralParams,
  SetType,
} from '..';
import { QueryParamType, request } from '../../../../utils/api';
import { requestError, requestLog } from '../../../../utils/log';
import { getFormData } from '../../../../utils/util';

interface DeleteFormRequestParams<T = any> extends FormRequestParams<T> {
  idName: string;
  type: SetType;
  parameterType: QueryParamType;
}

export interface DeleteParams extends PartialIdentifiableGeneralParams {
  id?: number | string;
}

export const deleteRequest = ({
  data,
  domain,
  endpoint: deleteEndpoint,
  forceRefresh,
  idName,
  manualUpdate,
  mode,
  verbosity,
  headers,
  onCompleted: onDeleted,
  parameterType,
  type,
}: DeleteFormRequestParams) => {
  return (
    e: FormEvent | undefined,
    params: DeleteParams = { method: 'DELETE', name: idName }
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    const formData = e && getFormData(e.target);

    const { method = 'DELETE', name = idName, id = formData?.[name] } = params;

    const endpoint = `${deleteEndpoint}/${
      parameterType == 'path' ? `${id}/` : ''
    }`;

    requestLog(
      mode,
      verbosity,
      1,
      `[delete][${method}]`,
      `${domain}/${endpoint}`
    );

    return request(domain, endpoint, {
      method,
      headers,
      mode,
      data: parameterType == 'path' ? '' : formData ?? '',
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
      } else {
        manualUpdate?.(data as any);
      }
      onDeleted?.() && forceRefresh?.();
    });
  };
};
