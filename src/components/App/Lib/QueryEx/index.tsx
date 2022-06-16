import { AllUsers as AllUsersGet, User as UserGet } from './get';
import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';

export const QueryEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'getAllUsers'}>Get All Users</Link>
        <Link to={'getUser'}>Get User</Link>
      </nav>
      <Routes>
        <Route path="getAllUsers" element={<AllUsersGet />} />
        <Route path="getUser" element={<UserGet />} />
        <Route path="*" element={<Navigate to={'getAllUsers'} />} />
      </Routes>
    </>
  );
};
