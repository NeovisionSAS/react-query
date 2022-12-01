import { FunctionComponent } from 'react';
import { User } from '../../../../../../interfaces';
import { CRUD } from '../../../../../utils';

export const MeCRUD: FunctionComponent = () => {
  return (
    <CRUD<User> endpoints={`me`}>
      {({ read: { data, loading }, handleUpdate }) => {
        if (loading) return <div>Loading...</div>;

        const { name, age, id, nationality, dateOfBirth } = data;

        return (
          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="id">ID : </label>
              <input
                type={'number'}
                name="id"
                defaultValue={id}
                key={id}
                disabled
              />
            </div>
            <div>
              <label htmlFor="name">Name : </label>
              <input name="name" defaultValue={name} key={name} />
            </div>
            <div>
              <label htmlFor="age">Age : </label>
              <input type="number" name="age" defaultValue={age} key={age} />
            </div>
            <div>
              <label htmlFor="dateOfBirth">Date of birth : </label>
              <input
                type="date"
                name="dateOfBirth"
                defaultValue={dateOfBirth}
                key={dateOfBirth}
              />
            </div>
            <div>
              <label htmlFor="nationality">Nationality :</label>
              <select
                name="nationality"
                defaultValue={nationality}
                key={nationality}
              >
                <option value={''}>Please choose an option</option>
                <option value={'french'}>French</option>
                <option value={'english'}>English</option>
              </select>
            </div>
            <button type={'submit'}>Update</button>
          </form>
        );
      }}
    </CRUD>
  );
};
