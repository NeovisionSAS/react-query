import { AllUsers } from 'components/App/Lib/QueryEx/get/AllUsers';
import { User } from 'components/App/Lib/QueryEx/get/User';
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
        <Route path="getAllUsers" element={<AllUsers />} />
        <Route path="getUser" element={<User />} />
        <Route path="*" element={<Navigate to={'getAllUsers'} />} />
      </Routes>
    </>
  );
};
