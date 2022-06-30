import {
  FormRequestParams,
  PartialIdentifiableGeneralParams,
  SetType,
} from '..';
import { QueryType, request } from '../../../../utils/api';
import { requestLog } from '../../../../utils/log';
import { formExtractor, getPathTail } from '../../../../utils/util';
import equal from 'fast-deep-equal';
import { FormEvent } from 'react';

interface UpdateFormRequestParams<T = any> extends FormRequestParams<T> {
  idName: string;
  type: SetType;
  parameterType: QueryType;
}

export interface UpdateParams extends PartialIdentifiableGeneralParams {
  name?: string;
}

export const updateRequest = ({
  idName,
  endpoint: updateEndpoint,
  mode,
  verbosity,
  domain,
  manualUpdate,
  data,
  headers,
  onCompleted: onUpdated,
  type,
  parameterType,
  forceRefresh,
}: UpdateFormRequestParams) => {
  return (
    e: FormEvent,
    params: UpdateParams = { method: 'PUT', name: idName }
  ) => {
    e.preventDefault();
    const { method = 'PUT', pathTail, name = idName } = params;

    const formDatas = formExtractor(e.target, name);

    let newData: any;
    if (type == 'array') newData = [...(data as unknown as any[])];
    else newData = data;

    const promises: Promise<any>[] = [];
    formDatas.forEach((formData) => {
      const tail = getPathTail(formData, parameterType, name, pathTail);

      const endpoint = `${updateEndpoint}/${tail ? `${tail}/` : ''}`;

      let hasChanged = false;
      if (type == 'array') {
        const index = (newData as any[]).findIndex((val) => val[name] == tail);
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
            data: formData,
            method,
            headers,
            mode,
          })
        );
      }
    });
    return Promise.all(promises).then(() => {
      manualUpdate?.(newData as any);
      onUpdated?.() && forceRefresh?.();
    });
  };
};
