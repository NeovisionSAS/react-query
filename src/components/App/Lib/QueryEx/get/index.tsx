import { User as UserInterface } from '../../../../../interfaces/user';
import { Query } from '../../../../utils';
import { FunctionComponent, useState } from 'react';

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
    </Query>
  );
};

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
          if (loading) return <div>loading...</div>;
          if (error) return <div>{error}</div>;

          return (
            <div>
              <ul>
                <li>ID : {user.id}</li>
                <li>Name : {user.name}</li>
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

export const AllUsersDelay: FunctionComponent = () => {
  const [delay, setDelay] = useState(1);

  return (
    <>
      <div>
        <p>Delay in seconds (10sec max)</p>
        <input
          type={'number'}
          value={delay}
          onChange={(e) => {
            const d = parseInt(e.target.value);
            setDelay(d > 10 ? 10 : d < 1 ? 0 : d);
          }}
        />
      </div>
      <Query<UserInterface[]> query={'user'} delay={delay * 1000}>
        {({ data: users, loading, error, forceRefresh }) => {
          if (loading) return <div>loading...</div>;
          if (error) return <div>{error}</div>;

          return (
            <>
              <button onClick={forceRefresh}>Refresh</button>
              <div>
                {users.map((user, i) => {
                  return (
                    <ul key={`allUsers-${i}`}>
                      <li>ID : {user.id}</li>
                      <li>Name : {user.name}</li>
                      <li>Age : {user.age}</li>
                      <li>
                        Nationality : {user.nationality ?? 'No nationality'}
                      </li>
                    </ul>
                  );
                })}
              </div>
            </>
          );
        }}
      </Query>
    </>
  );
};
