import { FunctionComponent } from 'react';
import { User } from '../../../../../../interfaces';
import { asFormTypes } from '../../../../../../utils/form';
import { CRUDAuto } from '../../../../../utils/CRUDAuto';
import style from './index.module.scss';

const userType = asFormTypes({
  id: { required: true, visible: false, pk: true, type: 'number' },
  nationality: {
    select: {
      options: ['Francaise', 'Anglaise', 'Quebequoise'].map((n) => ({
        value: n,
      })),
    },
  },
  book: {},
  dateOfBirth: {
    type: 'date',
    name: 'Date of birth',
    required: true,
  },
  personalInfo: {
    name: 'Informations personnelles',
    sub: {
      name: { required: true },
      age: { required: true, type: 'number' },
    },
  },
});

export const UserCRUDAuto: FunctionComponent = () => {
  return (
    <CRUDAuto<User, typeof userType> endPoints={'user'} type={userType}>
      {({ getForm }) => {
        return (
          <div>
            <h1>CREATE</h1>
            {getForm('create')}
            <h1>UPDATE</h1>
            {getForm('update', {
              className: style.main,
              deletable: false,
            })}
          </div>
        );
      }}
    </CRUDAuto>
  );
};

// Delete action
