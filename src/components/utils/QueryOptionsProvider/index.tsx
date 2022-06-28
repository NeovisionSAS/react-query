import {
  QueryOptions,
  RealQueryOptions,
  request,
  RequestOptionsWithDomain,
  RequestOptionsWithOptionalDomain,
} from '../../../utils/api';
import { contextGenerator } from '@generalizers/react-context';
import { DependencyList, useEffect, useMemo, useState } from 'react';

export const {
  useHook: useQueryOptions,
  Provider: QueryOptionsProvider,
  Consumer: QueryOptionsConsumer,
} = contextGenerator<RealQueryOptions, QueryOptions>(
  {
    domain: '',
    parameterType: 'path',
    mode: 'production',
    verbosity: 1,
    idName: 'id',
  },
  'QueryOptions'
);

export const useRequest = (
  rRest: RequestOptionsWithOptionalDomain = {
    method: 'GET',
  },
  dependencies?: DependencyList
) => {
  const [ignore, setIgnore] = useState(true);
  const [controller, setController] = useState<AbortController>(
    new AbortController()
  );
  const [{ loader, ...qRest }] = useQueryOptions();

  useEffect(() => {
    if (ignore)
      return () => {
        setIgnore(false);
      };

    return () => {
      controller.abort('The user aborted a request.');
      setController(new AbortController());
    };
  }, [controller, ignore]);

  return useMemo(() => {
    const merged = Object.merge<any, RequestOptionsWithDomain>(rRest, qRest);

    return <T = any,>(
      path: string,
      options: RequestOptionsWithOptionalDomain = { method: 'GET' }
    ) => {
      const { domain, ...returnMerged } = Object.merge<
        any,
        RequestOptionsWithDomain
      >(merged, options);
      return request<T>(domain, path, {
        ...returnMerged,
        signal: controller?.signal,
      });
    };
  }, [...(dependencies ?? []), controller]);
};
