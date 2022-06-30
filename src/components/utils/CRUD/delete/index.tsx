import {
  FormRequestParams,
  PartialIdentifiableParams,
  SetType,
} from '..';
import { FormEvent } from 'react';
import { QueryType, request } from '../../../../utils/api';
import { requestLog } from '../../../../utils/log';
import { getFormData, getPathTail } from '../../../../utils/util';

interface DeleteFormRequestParams<T = any> extends FormRequestParams<T> {
  idName: string;
  type: SetType;
  parameterType: QueryType;
}

export interface DeleteParams extends PartialIdentifiableParams {
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
    const { method = 'DELETE', pathTail, name = idName, id } = params;

    const tail = getPathTail(
      { [name]: id?.toString() ?? '' },
      parameterType,
      name,
      pathTail
    );

    const endpoint = `${deleteEndpoint}/${tail ? `${tail}/` : ''}`;

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
      data: parameterType == 'path' ? '' : e ? getFormData(e.target) : '',
    }).then(() => {
      if (type == 'array') {
        const index = (data as unknown as any[]).findIndex(
          (val) => val[name] == id
        );
        const typedData = data as unknown as any[];
        requestLog(mode, verbosity, 3, `Removing index ${index}`);
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
