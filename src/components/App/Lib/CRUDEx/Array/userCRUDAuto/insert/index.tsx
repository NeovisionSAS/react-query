import { FunctionComponent } from 'react';
import { User } from '../../../../../../../interfaces';
import { asFormTypes } from '../../../../../../../utils/form';
import { CRUDAuto } from '../../../../../../utils/CRUDAuto';

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
      {({ forms: { CreateForm, EntriesForm } }) => {
        return (
          <div>
            <h1>CREATE</h1>
            <CreateForm
              options={{
                insert: {
                  before: [['name', () => <div>I am before name</div>]],
                  after: [['name', () => <div>I am after name</div>]],
                },
              }}
            />
            <h1>UPDATE</h1>
            <EntriesForm
              options={{
                insert: {
                  before: [['name', () => <div>I am before name</div>]],
                  after: [['name', () => <div>I am after name</div>]],
                },
              }}
            >
              {({ UpdateForm, DeleteForm }) => {
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
