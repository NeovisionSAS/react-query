import { FunctionComponent } from 'react';
import { User } from '../../../../../../interfaces';
import { asFormTypes } from '../../../../../../module';
import { CRUDAuto } from '../../../../../utils/CRUDAuto';

const userType = asFormTypes({
  id: { required: true, visible: false, pk: true, type: 'number' },
  name: { required: true },
  age: { required: true, type: 'number' },
  nationality: {
    select: {
      options: ['french', 'english'].map((n) => ({
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

export const MeCRUDAuto: FunctionComponent = () => {
  return (
    <CRUDAuto<User, typeof userType> endpoints={`me`} type={userType}>
      {({
        data: {
          read: { loading },
        },
        forms: { EntriesForm },
      }) => {
        if (loading) return <div>Loading...</div>;

        return <EntriesForm>{({ UpdateForm }) => <UpdateForm />}</EntriesForm>;
      }}
    </CRUDAuto>
  );
};
