import { CRUDEventHandler, FormRequestParams, PartialGeneralParams } from '..';
import { request, requestOptionsMerge } from '../../../../utils/api';
import { setCache } from '../../../../utils/cache';
import { isFormEvent } from '../../../../utils/form';
import { requestLog } from '../../../../utils/log';
import { getFormData } from '../../../../utils/util';

export type CreateParams = PartialGeneralParams;

type CreateFormRequestParams<T> = FormRequestParams<T>;

export const createRequest = <T, U = T extends Array<infer R> ? R : T>({
  endpoint: { endpoint, mode, verbosity, domain, headers, dateFormat, ...eRest },
  manualUpdate,
  onCompleted: onCreated,
  forceRefresh,
  cacheKey,
  data,
}: CreateFormRequestParams<any>) => {
  return (e: CRUDEventHandler<U>, params: CreateParams = {}) => {
    const { method = 'POST', onRejected } = requestOptionsMerge([
      eRest,
      params,
    ]);

    let formData;

    if (isFormEvent(e)) {
      e.preventDefault();
      formData = getFormData(e.target, { dateFormat });
    } else formData = e;

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
      return created;
    });
  };
};
