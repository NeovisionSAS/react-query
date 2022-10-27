import { FormEvent } from 'react';
import { FormRequestParams, PartialGeneralParams } from '..';
import { request, requestOptionsMerge } from '../../../../utils/api';
import { setCache } from '../../../../utils/cache';
import { requestLog } from '../../../../utils/log';
import { getFormData } from '../../../../utils/util';

export type CreateParams = PartialGeneralParams;

type CreateFormRequestParams<T> = FormRequestParams<T>;

export const createRequest = ({
  endpoint: { endpoint, mode, verbosity, domain, headers, ...eRest },
  manualUpdate,
  onCompleted: onCreated,
  forceRefresh,
  cacheKey,
  data,
}: CreateFormRequestParams<any>) => {
  return (e: FormEvent, params: CreateParams = { method: 'POST' }) => {
    e.preventDefault();

    const { method = 'POST', onRejected } = requestOptionsMerge([
      eRest,
      params,
    ]);

    const formData = getFormData(e.target);

    requestLog(
      mode,
      verbosity,
      1,
      `[create][${method}]`,
      `${domain}/${endpoint}/`,
      formData
    );

    return request(domain, `${endpoint}/`, {
      data: formData,
      method,
      headers,
      mode,
      onRejected,
    }).then((created) => {
      const newData = [...data, created] as any;
      if (data) manualUpdate?.(newData);
      setCache(cacheKey, newData);
      onCreated?.() && forceRefresh?.();
    });
  };
};
