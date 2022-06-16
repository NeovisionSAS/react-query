import { User as UserInterface } from '../../../../../interfaces/user';
import { CRUD } from '../../../../utils';
import { FunctionComponent } from 'react';

export const AllUsers: FunctionComponent = () => {
  return (
    <CRUD<UserInterface[]> endPoints={`user`}>
      {({ read: { data: users, loading, error } }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>{error}</div>;

        return (
          <div>
            {users.map((user, i) => {
              return (
                <ul key={`allUsers-${i}`}>
                  <li>ID : {user.id}</li>
                  <li>Name : {user.name}</li>
                  <li>Age : {user.age}</li>
                  <li>Nationality : {user.nationality ?? 'No nationality'}</li>
                </ul>
              );
            })}
          </div>
        );
      }}
    </CRUD>
  );
};
