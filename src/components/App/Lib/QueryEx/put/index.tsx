import { CRUD } from '../../../../utils';
import { User as UserInterface } from '../../../../../interfaces/user';
import { FunctionComponent } from 'react';

export const User: FunctionComponent = () => {
  return (
    <>
      <CRUD<UserInterface[]> endPoints={`user`}>
        {({ read: { data: users, loading, error }, handleUpdate }) => {
          if (loading) return <div>loading...</div>;
          if (error) return <div>{error}</div>;

          return (
            <>
              {users.map((user, i) => {
                return (
                  <form
                    key={`userPut-${i}`}
                    onSubmit={(e) => handleUpdate(e, { name: 'id' })}
                  >
                    <input
                      name="id"
                      defaultValue={user.id}
                      type={'number'}
                      style={{ display: 'none' }}
                      required
                    />
                    <div>
                      <label htmlFor="name">Name *</label>
                      <input
                        name="name"
                        id="name"
                        defaultValue={user.name}
                        type="text"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="age">Age *</label>
                      <input
                        name="age"
                        id="age"
                        defaultValue={user.age}
                        type="number"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="nationality">Nationality</label>
                      <select
                        id="nationality"
                        name="nationality"
                        defaultValue={user.nationality}
                      >
                        <option value={''}>Please choose an option</option>
                        <option value={'french'}>French</option>
                        <option value={'english'}>English</option>
                      </select>
                    </div>
                    <button type="submit">Submit</button>
                  </form>
                );
              })}
            </>
          );
        }}
      </CRUD>
    </>
  );
};
