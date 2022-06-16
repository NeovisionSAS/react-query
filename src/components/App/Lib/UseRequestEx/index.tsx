import { useRequest } from '../../../utils/QueryOptionsProvider';
import { User } from '../../../../interfaces/user';
import { FunctionComponent, useState } from 'react';

export const UseRequestEx: FunctionComponent = () => {
  const [user, setUser] = useState<User>();
  const request = useRequest();

  request<User>('user', { method: 'GET' })
    .then((user) => {
      setUser(user);
    })
    .catch((e) => console.error(e));

  return (
    <div>
      <div>{user?.name}</div>
      <div>{user?.name}</div>
    </div>
  );
};
