import { FunctionComponent, useState } from 'react';
import { File } from '../../../../../interfaces/file';
import { User as UserInterface } from '../../../../../interfaces/user';
import { Query } from '../../../../utils';
import {
  QueryOptionsProvider,
  useQueryOptions,
} from '../../../../utils/QueryOptionsProvider';

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
                <ul key={i}>
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
                    <ul key={i}>
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

export const UserBook: FunctionComponent = () => {
  const [id, setId] = useState(1);
  return (
    <>
      <input
        type={'number'}
        value={id}
        onChange={(v) => setId(parseInt(v.target.value))}
      />
      <Query<string> query={`user/book?id=${id}`}>
        {({ data, loading, error }) => {
          if (loading) {
            if (typeof loading != 'boolean')
              return <div>{loading.total.percentage}</div>;
            return <div>{}</div>;
          }
          if (error) return <div>{error}</div>;

          return <div>{data}</div>;
        }}
      </Query>
    </>
  );
};

export const Files: FunctionComponent = () => {
  return (
    <Query<File[]> query={'file'}>
      {({ data: files, loading, error }) => {
        if (loading) return <div>loading...</div>;
        if (error) return <div>{error}</div>;

        return (
          <div>
            {files.length > 0 ? (
              files.map((file, i) => {
                return (
                  <ul key={i}>
                    <li>File name : {file.name}</li>
                    <li>File size : {file.size} bytes</li>
                  </ul>
                );
              })
            ) : (
              <>No files</>
            )}
          </div>
        );
      }}
    </Query>
  );
};

export const Auth: FunctionComponent = () => {
  const [{ domain }] = useQueryOptions();

  return (
    <QueryOptionsProvider
      value={{
        domain,
        onRejected: (e) => {
          console.log(`My request was rejected with error ${e.status} :(`, e);
        },
      }}
    >
      <Query query={'user/auth'}>
        {({}) => {
          return <div></div>;
        }}
      </Query>
    </QueryOptionsProvider>
  );
};
