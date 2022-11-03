import { FunctionComponent } from 'react';
import { User } from '../../../../../../../interfaces';
import { asFormTypes } from '../../../../../../../utils/form';
import { CRUDAuto } from '../../../../../../utils/CRUDAuto';
import style from './index.module.scss';

const userType = asFormTypes({
  id: { required: true, visible: false, pk: true, type: 'number' },
  name: { required: true },
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

export const UserCRUDAutoInsert: FunctionComponent = () => {
  return (
    <CRUDAuto<User, typeof userType> endpoints={'user'} type={userType}>
      {({ getCreateForm, getUpdateForms }) => {
        return (
          <div>
            <h1>CREATE</h1>
            {getCreateForm({
              options: {
                insert: {
                  before: [['name', () => <div>I am before name</div>]],
                  after: [['name', () => <div>I am after name</div>]],
                },
              },
            })}
            <h1>UPDATE</h1>
            {getUpdateForms({
              options: {
                className: style.main,
                insert: {
                  before: [['name', () => <div>I am before name</div>]],
                  after: [['name', () => <div>I am after name</div>]],
                },
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

// Delete action
