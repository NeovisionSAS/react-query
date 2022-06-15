import { Query } from 'components/utils';
import { User as UserInterface } from 'interfaces/user';
import { FunctionComponent } from 'react';

export const AllUsers: FunctionComponent = () => {
  return (
    <Query<UserInterface[]> query={'user'}>
      {({ data: users, loading, error }) => {
        if (loading) return <div>loading...</div>;
        if (error) return <div>{error}</div>;

        return (
          <div>
            {users.map((user, i) => {
              return (
                <ul key={`allUsers-${i}`}>
                  <li>Name: {user.name}</li>
                  <li>Age : {user.age}</li>
                  <li>Nationality : {user.nationality ?? 'No nationality'}</li>
                </ul>
              );
            })}
          </div>
        );
      }}
    </Query>
  );
};
