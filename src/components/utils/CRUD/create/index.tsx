import { FormRequestParams, PartialGeneralParams } from '..';
import { request } from '../../../../utils/api';
import { requestLog } from '../../../../utils/log';
import { getFormData } from '../../../../utils/util';
import { FormEvent } from 'react';

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
}: CreateFormRequestParams<any>) => {
  return (e: FormEvent, params: CreateParams = { method: 'POST' }) => {
    e.preventDefault();
    const { method = 'POST' } = params;
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
    })
      .then((created) => {
        if (data) manualUpdate?.([...data, created] as any);
        onCreated?.() && forceRefresh?.();
      })
      .catch(() => {
        console.error(
          `Erreur de création`,
          `Une erreur est survenu lors de la création dans la base de données`
        );
      });
  };
};
