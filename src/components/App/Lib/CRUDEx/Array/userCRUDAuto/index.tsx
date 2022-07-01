import { CRUDAuto } from '../../../../../utils/CRUDAuto';
import { FunctionComponent } from 'react';

export const UserCRUDAuto: FunctionComponent = () => {
  return <CRUDAuto endpoints={'user'}>Hello ?</CRUDAuto>;
};
