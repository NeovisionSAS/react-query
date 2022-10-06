import { FunctionComponent } from 'react';
import { asFormTypes } from '../../../../../utils/form';
import { CRUDAuto } from '../../../../utils/CRUDAuto';

const userType = asFormTypes({ hello: { name: 'Hello' } });

export const ArrayEx: FunctionComponent = () => {
  return (
    <CRUDAuto endpoints={'user'} type={userType}>
      {({ getForm }) => {
        return getForm('create');
      }}
    </CRUDAuto>
  );
};
