import { FunctionComponent } from 'react';
import { User as UserInterface } from '../../../../../../interfaces/user';
import { CRUD } from '../../../../../utils';

export const User: FunctionComponent = () => {
  return (
    <CRUD<UserInterface[]> endpoints={`user`}>
      {({ read: { data: users, loading, error }, handleDelete }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>{error}</div>;

        return (
          <>
            {users.map((user, i) => {
              return (
                <form
                  key={`userDelete-${i}`}
                  onSubmit={(e) => handleDelete(e, { id: user.id })}
                >
                  <input name="id" type={'number'} defaultValue={user.id} />
                  <div>{`Name : ${user.name}`}</div>
                  <button>Delete</button>
                </form>
              );
            })}
          </>
        );
      }}
    </CRUD>
  );
};
