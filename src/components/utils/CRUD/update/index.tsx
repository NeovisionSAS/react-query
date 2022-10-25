import equal from 'fast-deep-equal';
import { FormEvent } from 'react';
import {
  FormRequestParams,
  PartialIdentifiableGeneralParams,
  SetType,
} from '..';
import { QueryParamType, request } from '../../../../utils/api';
import { setCache } from '../../../../utils/cache';
import { requestError, requestLog } from '../../../../utils/log';
import { formExtractor } from '../../../../utils/util';

interface UpdateFormRequestParams<T = any> extends FormRequestParams<T> {
  idName: string;
  type: SetType;
  parameterType: QueryParamType;
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
  cacheKey,
  onRejected,
}: UpdateFormRequestParams) => {
  return (
    e: FormEvent,
    params: UpdateParams = { method: 'PUT', name: idName }
  ) => {
    e.preventDefault();

    const {
      method = 'PUT',
      name = idName,
      onRejected: onRejectedOverride,
    } = params;

    const reject = onRejectedOverride ?? onRejected;

    const formDatas = formExtractor(e.target, name);

    let newData: any;
    if (type == 'array') newData = [...(data as unknown as any[])];
    else newData = data;

    const promises: Promise<any>[] = [];
    formDatas.forEach((formData) => {
      const id = formData[name];

      const endpoint = `${updateEndpoint}/${
        parameterType == 'path' ? `${id}/` : ''
      }`;

      let hasChanged = false;
      if (type == 'array') {
        const index = (newData as any[]).findIndex((val) => val[name] == id);
        if (index < 0) {
          requestError(`Element with ${name} ${id} not found.`);
          throw new Error(`Element with ${name} ${id} not found.`);
        }
        const mergedData = {
          ...newData[index],
          ...formData,
        };
        hasChanged = !equal(newData[index], mergedData);
        newData[index] = mergedData;
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
            onRejected: reject,
          })
        );
      }
    });
    return Promise.all(promises).then(() => {
      manualUpdate?.(newData as any);
      setCache(cacheKey, newData);
      onUpdated?.() && forceRefresh?.();
    });
  };
};
