import { useQueryOptions } from '../utils/QueryOptionsProvider';
import { FunctionComponent } from 'react';

export const Test: FunctionComponent = () => {
  const queryOptions = useQueryOptions();

  return <div>{JSON.stringify(queryOptions)}</div>;
};
