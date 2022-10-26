import { contextGenerator } from '@generalizers/react-context';
import { DependencyList, useEffect, useMemo, useState } from 'react';
import {
  QueryOptions,
  RealQueryOptions,
  request,
  RequestOptionsWithDomain,
  RequestOptionsWithOptionalDomain,
} from '../../../utils/api';

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
    cache: 60 * 5,
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
    const merged = Object.merge<any, RequestOptionsWithDomain>(rRest, qRest, {
      onRejected: (e: any) => {
        rRest.onRejected?.(e);
        qRest.onRejected?.(e);
      },
    });

    return <T = any,>(
      path: string,
      options: RequestOptionsWithOptionalDomain = { method: 'GET' }
    ) => {
      const { domain, signal, ...returnMerged } = Object.merge<
        any,
        RequestOptionsWithDomain
      >(merged, options, {
        onRejected: (e: any) => {
          options.onRejected?.(e);
          merged.onRejected?.(e);
        },
      });
      return request<T>(domain, path, {
        ...returnMerged,
        signal: signal ?? controller?.signal,
      });
    };
  }, [...(dependencies ?? []), controller]);
};
