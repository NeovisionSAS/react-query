import { DependencyList, useEffect, useMemo, useState } from 'react';
import { useQueryOptions } from '../../components/utils/QueryOptionsProvider';
import {
  Reject,
  request,
  RequestOptionsWithDomain,
  RequestOptionsWithOptionalDomain,
} from '../../utils/api';

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
      });
      return request<T>(domain, path, {
        ...returnMerged,
        signal: signal ?? controller?.signal,
      });
    };
  }, [...(dependencies ?? []), controller]);
};
