import { QueryHookParams, QueryReturn, useQuery } from '../../../hooks/query';
import { Loadable, parseLoader } from '../../../utils/api';
import ErrorBoundary from '../ErrorBoundary';
import { useQueryOptions } from '../QueryOptionsProvider';
import { StateFunction } from '../StateFunction';
import React from 'react';

export interface QueryProps<T = any> extends QueryHookParams<T>, Loadable {
  children: (qReturn: QueryReturn<T>) => JSX.Element;
}

/**
 * The query component is a fetch wrapper that allows to directly add logic in the design of the react DOM architecture
 */
export const Query: <T = any>(
  p: QueryProps<T>
) => React.ReactElement<QueryProps<T>> = ({
  children,
  loader: qLoader,
  ...qRest
}) => {
  const [{ loader: oLoader }] = useQueryOptions();
  const { loading, ...qData } = useQuery(qRest);

  const loader = Object.merge(parseLoader(oLoader), parseLoader(qLoader));

  return (
    <ErrorBoundary>
      {loading && loader.autoload ? (
        <>{loader.loader ?? <div>Loading data...</div>}</>
      ) : (
        <StateFunction>{() => children({ loading, ...qData })}</StateFunction>
      )}
    </ErrorBoundary>
  );
};
