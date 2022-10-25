import { FormEvent } from 'react';
import { FormRequestParams, PartialGeneralParams } from '..';
import { request } from '../../../../utils/api';
import { setCache } from '../../../../utils/cache';
import { requestLog } from '../../../../utils/log';
import { getFormData } from '../../../../utils/util';

export type CreateParams = PartialGeneralParams;

type CreateFormRequestParams<T> = FormRequestParams<T>;

export const createRequest = ({
  endpoint: createEndpoint,
  mode,
  verbosity,
  domain,
  manualUpdate,
  data,
  headers,
  onCompleted: onCreated,
  forceRefresh,
  cacheKey,
  onRejected,
}: CreateFormRequestParams<any>) => {
  return (e: FormEvent, params: CreateParams = { method: 'POST' }) => {
    e.preventDefault();
    const { method = 'POST', onRejected: onRejectedOverride } = params;
    const reject = onRejectedOverride ?? onRejected;
    const formData = getFormData(e.target);

    requestLog(
      mode,
      verbosity,
      1,
      `[create][${method}]`,
      `${domain}/${createEndpoint}/`,
      formData
    );

    return request(domain, `${createEndpoint}/`, {
      data: formData,
      method,
      headers,
      mode,
      onRejected: reject,
    }).then((created) => {
      const newData = [...data, created] as any;
      if (data) manualUpdate?.(newData);
      setCache(cacheKey, newData);
      onCreated?.() && forceRefresh?.();
    });
  };
};
