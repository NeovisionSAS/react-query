import { FunctionComponent } from 'react';
import { User } from '../../../../../../../interfaces';
import { asFormTypes } from '../../../../../../../utils/form';
import { CRUDAuto } from '../../../../../../utils/CRUDAuto';

const userType = asFormTypes({
  id: { required: true, visible: false, pk: true, type: 'number' },
  name: {
    required: true,
  },
  age: { required: true, type: 'number' },
  nationality: {
    select: {
      options: ['Francaise', 'Anglaise', 'Quebequoise'].map((n) => ({
        value: n,
      })),
    },
  },
  dateOfBirth: {
    type: 'date',
    name: 'Date of birth',
    required: true,
  },
});

export const UserCRUDAutoCustom: FunctionComponent = () => {
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
                override: {
                  name: {
                    render({ oName, value }) {
                      return (
                        <div>
                          <label>{oName}</label>
                          <div>{value}</div>
                        </div>
                      );
                    },
                  },
                },
              },
            }).map(({ Form }) => (
              <Form />
            ))}
          </div>
        );
      }}
    </CRUDAuto>
  );
};
