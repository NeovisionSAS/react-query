import { FunctionComponent, useState } from 'react';
import { User } from '../../../../../interfaces';
import { Query } from '../../../../utils';

export const PostAllUsers: FunctionComponent = () => {
  return (
    <Query<User[]> query="user/get" method="POST">
      {({ data: users, loading }) => {
        if (loading) return <div>Loading...</div>;

        return (
          <>
            {users.map((user, i) => {
              return <div key={`user-${i}`}>{user.name}</div>;
            })}
          </>
        );
      }}
    </Query>
  );
};

export const PostUser: FunctionComponent = () => {
  const [id, setId] = useState(0);

  const formData = new FormData();

  formData.append('id', id.toString());

  return (
    <div>
      <input
        min={0}
        type={'number'}
        value={id}
        onChange={(e) => setId(parseInt(e.target.value))}
      />
      <Query<User> query="user/get" method="POST" data={formData}>
        {({ data: user, loading, error }) => {
          if (loading) return <div>Loading...</div>;
          if (error)
            return (
              <div>
                id {id} {error}
              </div>
            );

          return <div>{user.name}</div>;
        }}
      </Query>
    </div>
  );
};
