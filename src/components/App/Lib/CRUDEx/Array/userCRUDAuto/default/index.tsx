import { Fragment, FunctionComponent } from 'react';
import { User } from '../../../../../../../interfaces';
import { asFormTypes } from '../../../../../../../utils/form';
import { CRUDAuto } from '../../../../../../utils/CRUDAuto';
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

export const UserCRUDAutoDefault: FunctionComponent = () => {
  return (
    <CRUDAuto<User, typeof userType> endpoints={'user'} type={userType}>
      {({ getCreateForm, getUpdateForms }) => {
        return (
          <div>
            <h1>CREATE</h1>
            {getCreateForm()}
            <h1>UPDATE</h1>
            {getUpdateForms({
              options: {
                className: style.main,
              },
            }).map(({ Form, DeleteForm }, i) => (
              <Fragment key={`form-${i}`}>
                <Form />
                <DeleteForm />
              </Fragment>
            ))}
          </div>
        );
      }}
    </CRUDAuto>
  );
};

// Delete action
