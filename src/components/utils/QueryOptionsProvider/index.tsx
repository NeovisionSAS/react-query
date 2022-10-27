import { contextGenerator } from '@generalizers/react-context';
import { QueryOptions, RealQueryOptions } from '../../../utils/api';

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
