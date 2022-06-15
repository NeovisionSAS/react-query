import { Query } from 'components/utils';
import { User as UserInterface } from 'interfaces/user';
import { FunctionComponent, useState } from 'react';

export const User: FunctionComponent = () => {
  const [id, setId] = useState(1);
  return (
    <>
      <input
        type={'number'}
        value={id}
        onChange={(v) => setId(parseInt(v.target.value))}
      />
      <Query<UserInterface> query={`user?id=${id}`}>
        {({ data: user, loading, error }) => {
          if (loading) return <div>'loading...'</div>;
          if (error) return <div>{error}</div>;

          return (
            <div>
              <ul>
                <li>Name: {user.name}</li>
                <li>Age : {user.age}</li>
                <li>Nationality : {user.nationality ?? 'No nationality'}</li>
              </ul>
            </div>
          );
        }}
      </Query>
    </>
  );
};
