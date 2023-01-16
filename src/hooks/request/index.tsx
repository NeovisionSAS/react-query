import { useQueryOptions } from '../../components/utils/QueryOptionsProvider';
import {
  Reject,
  request,
  RequestOptionsWithDomain,
  RequestOptionsWithOptionalDomain,
} from '../../utils/api';
import { DependencyList, useEffect, useMemo, useState } from 'react';

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
      onRejected: (rej: Reject) => {
        rRest.onRejected?.(rej);
        qRest.onRejected?.(rej);
      },
      headers: () => {
        return Promise.all([rRest.headers?.(), qRest.headers?.()]).then(
          ([t1 = {}, t2 = {}]) => Object.merge({}, t1, t2)
        );
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
        onRejected: (rej: Reject) => {
          options.onRejected?.(rej);
          merged.onRejected?.(rej);
        },
        headers: () => {
          return Promise.all([options.headers?.(), merged.headers?.()]).then(
            ([t1 = {}, t2 = {}]) => Object.merge({}, t1, t2)
          );
        },
      });
      return request<T>(domain, path, {
        ...returnMerged,
        signal: signal ?? controller?.signal,
      });
    };
  }, [...(dependencies ?? []), controller]);
};
