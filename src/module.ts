import '@generalizers/prototype-expansion';
import { CRUD, CRUDObject } from './components/utils/CRUD';
import { CRUDAuto } from './components/utils/CRUDAuto';
import { Query, useQuery } from './components/utils/Query';
import {
  QueryOptionsProvider,
  useQueryOptions,
  useRequest,
} from './components/utils/QueryOptionsProvider';
import './scss/defaults.scss';
import { request } from './utils/api';

export {
  CRUD,
  Query,
  request,
  CRUDAuto,
  useQuery,
  useRequest,
  CRUDObject,
  useQueryOptions,
  QueryOptionsProvider,
};
