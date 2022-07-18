import { CRUD, CRUDObject } from './components/utils/CRUD';
import { Query, useQuery } from './components/utils/Query';
import {
  QueryOptionsProvider,
  useQueryOptions,
  useRequest,
} from './components/utils/QueryOptionsProvider';
import { request } from './utils/api';
import '@generalizers/prototype-expansion';

export {
  CRUD,
  Query,
  CRUDObject,
  QueryOptionsProvider,
  request,
  useRequest,
  useQueryOptions,
  useQuery,
};
