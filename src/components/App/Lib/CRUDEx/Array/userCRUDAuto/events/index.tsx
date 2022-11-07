import { FunctionComponent } from 'react';
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
      name: {
        required: true,
        onValueChanged: (v) => console.log(`New value is ${v}`),
      },
      age: {
        required: true,
        type: 'number',
        render: ({ oName, value, setValue }) => {
          return (
            <div>
              <div>{oName.capitalize()}</div>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue?.(e.target.value)}
              />
            </div>
          );
        },
      },
    },
  },
});

export const UserCRUDAutoEvents: FunctionComponent = () => {
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
            }).map(({ Form }, i) => (
              <Form key={`form-${i}`} />
            ))}
          </div>
        );
      }}
    </CRUDAuto>
  );
};
