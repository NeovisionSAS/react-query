import {
  QueryOptions,
  RealQueryOptions,
  request,
  RequestOptionsWithDomain,
  RequestOptionsWithOptionalDomain,
} from '../../../utils/api';
import { createContext, useContext } from 'react';

const queryOptionsContext = createContext<QueryOptions>({
  domain: '',
  parameterType: 'path',
  mode: 'production',
  verbosity: 1,
  idName: 'id',
});

export const useQueryOptions = (): RealQueryOptions => {
  const ctx = useContext(queryOptionsContext);
  if (!ctx) throw new Error("No context for 'useQueryOptions'");
  if (!ctx.idName) ctx.idName = 'id';
  return ctx as Required<QueryOptions>;
};

export const useRequest = (
  rRest: RequestOptionsWithOptionalDomain = {
    method: 'GET',
  }
) => {
  const { loader, ...qRest } = useQueryOptions();

  const merged = Object.merge<any, RequestOptionsWithDomain>(rRest, qRest);

  return <T = any,>(
    path: string,
    options: RequestOptionsWithOptionalDomain = { method: 'GET' }
  ) => {
    const { domain, ...returnMerged } = Object.merge<
      any,
      RequestOptionsWithDomain
    >(merged, options);
    return request<T>(domain, path, returnMerged);
  };
};

export const QueryOptionsProvider = queryOptionsContext.Provider;
