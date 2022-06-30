import { FormRequestParams, PartialGeneralParams } from '..';
import { request } from '../../../../utils/api';
import { requestLog } from '../../../../utils/log';
import { getFormData } from '../../../../utils/util';
import { FormEvent } from 'react';

export type CreateParams = PartialGeneralParams;

type CreateFormRequestParams<T = any> = FormRequestParams<T>;

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
}: CreateFormRequestParams) => {
  return (e: FormEvent, params: CreateParams = { method: 'POST' }) => {
    e.preventDefault();
    const { method = 'POST', pathTail } = params;
    const formData = getFormData(e.target);

    const endpoint = `${createEndpoint}/${pathTail ? `${pathTail}/` : ''}`;

    requestLog(
      mode,
      verbosity,
      1,
      `[create][${method}]`,
      `${domain}/${endpoint}`,
      formData
    );

    return request(domain, endpoint, {
      data: formData,
      method,
      headers,
      mode,
    })
      .then((created) => {
        manualUpdate?.([...data, created] as any);
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
