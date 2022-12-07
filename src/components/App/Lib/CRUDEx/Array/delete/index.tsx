import { User as UserInterface } from '../../../../../../interfaces/user';
import { CRUD } from '../../../../../utils';
import { FunctionComponent } from 'react';

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
                <div key={`userDelete-${i}`}>
                  <div>{`Name : ${user.name}`}</div>
                  <button onClick={() => handleDelete({ id: user.id })}>
                    Delete
                  </button>
                </div>
              );
            })}
          </>
        );
      }}
    </CRUD>
  );
};
