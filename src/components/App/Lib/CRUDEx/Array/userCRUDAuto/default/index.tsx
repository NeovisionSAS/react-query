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
      name: { required: true },
      age: { required: true, type: 'number' },
    },
  },
});

export const UserCRUDAutoDefault: FunctionComponent = () => {
  return (
    <CRUDAuto<User[], typeof userType> endpoints={'user'} type={userType}>
      {({ forms: { CreateForm, EntriesForm }, data }) => {
        return (
          <div>
            <h1>CREATE</h1>
            <CreateForm />
            <h1>UPDATE</h1>
            <EntriesForm options={{ className: style.main }}>
              {({ UpdateForm, DeleteForm, data }) => {
                return (
                  <>
                    <UpdateForm />
                    <DeleteForm />
                  </>
                );
              }}
            </EntriesForm>
          </div>
        );
      }}
    </CRUDAuto>
  );
};

// Delete action
