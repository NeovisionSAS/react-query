import '@generalizers/prototype-expansion';
import { CRUD, CRUDObject } from './components/utils/CRUD';
import {
  CRUDAuto,
  FormCreateType,
  FormOptions,
  FormOptionsInsert,
  FormOptionsInsertOrder,
} from './components/utils/CRUDAuto';
import { Query } from './components/utils/Query';
import {
  QueryOptionsProvider,
  useQueryOptions,
} from './components/utils/QueryOptionsProvider';
import { useQuery } from './hooks/query';
import { useRequest } from './hooks/request';
import './scss/defaults.scss';
import { request } from './utils/api';
import {
  asFormTypes,
  createFormObject,
  FormType,
  KeysToFormType,
} from './utils/form';

export {
  CRUD,
  Query,
  request,
  CRUDAuto,
  useQuery,
  FormType,
  useRequest,
  CRUDObject,
  asFormTypes,
  FormOptions,
  KeysToFormType,
  FormCreateType,
  useQueryOptions,
  createFormObject,
  FormOptionsInsert,
  QueryOptionsProvider,
  FormOptionsInsertOrder,
};
