import {
  AllUsers as AllUsersGet,
  AllUsersDelay as AllUsersDelayGet,
  User as UserGet,
} from './get';
import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';

export const QueryEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'getAllUsers'}>Get All Users</Link>
        <Link to={'getUser'}>Get User</Link>
        <Link to={'getAllUsersDelay'}>Get All Users Delay</Link>
      </nav>
      <Routes>
        <Route path="getAllUsers" element={<AllUsersGet />} />
        <Route path="getUser" element={<UserGet />} />
        <Route path="getAllUsersDelay" element={<AllUsersDelayGet />} />
        <Route path="*" element={<Navigate to={'getAllUsers'} />} />
      </Routes>
    </>
  );
};
