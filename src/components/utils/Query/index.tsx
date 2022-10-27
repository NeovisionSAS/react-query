import React from 'react';
import { QueryHookParams, QueryReturn, useQuery } from '../../../hooks/query';
import ErrorBoundary from '../ErrorBoundary';
import { useQueryOptions } from '../QueryOptionsProvider';

export interface QueryProps<T = any> extends QueryHookParams<T> {
  children: (qReturn: QueryReturn<T>) => JSX.Element;
}

/**
 * The query component is a fetch wrapper that allows to directly add logic in the design of the react DOM architecture
 */
export const Query: <T = any>(
  p: QueryProps<T>
) => React.ReactElement<QueryProps<T>> = ({ children, ...qRest }) => {
  const [{ loader }] = useQueryOptions();
  const { loading, ...qData } = useQuery(qRest);

  // Always call to maintain the hooks
  const render = children({ loading, ...qData });

  return (
    <ErrorBoundary>
      {loading && loader && loader.autoload ? (
        <>{loader.loader ?? <div>Loading data...</div>}</>
      ) : (
        render
      )}
    </ErrorBoundary>
  );
};
