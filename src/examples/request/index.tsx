import { useRequest } from '../../components/utils/QueryOptionsProvider';
import { request } from '../../utils/api';
import { FunctionComponent, useEffect, useState } from 'react';

request('mydomain.com', 'users/names').then((text) => {
  console.log(text);
});

request('mydomain.com', 'users/changeName/1', {
  method: 'POST',
  body: JSON.stringify({ name: 'Gerald' }),
  headers: () => Promise.resolve({ 'Content-Type': 'application/json' }),
}).then((json) => {
  console.log(json);
});

request('mydomain.com', 'users/delete/1', {
  method: 'DELETE',
})
  .then((res) => {
    console.log('User deleted');
  })
  .catch((err) => {
    console.error('Cannot delete user 1', err);
  });

const UserList: FunctionComponent = () => {
  const [users, setUsers] = useState<any[]>();
  const request = useRequest();

  useEffect(() => {
    request('/users').then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <div>
      {users?.map((user: any) => {
        return <p>user.name</p>;
      })}
    </div>
  );
};
