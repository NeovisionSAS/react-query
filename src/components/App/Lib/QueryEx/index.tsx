import { User as UserDelete } from 'components/App/Lib/QueryEx/delete';
import {
  AllUsers as AllUsersGet,
  User as UserGet,
} from 'components/App/Lib/QueryEx/get';
import { User as UserPost } from 'components/App/Lib/QueryEx/post';
import { User as UserPut } from 'components/App/Lib/QueryEx/put';
import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';

export const QueryEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'getAllUsers'}>Get All Users</Link>
        <Link to={'getUser'}>Get User</Link>
        <Link to={'postUser'}>Post User</Link>
        <Link to={'putUser'}>Put User</Link>
        <Link to={'deleteUser'}>Delete User</Link>
      </nav>
      <Routes>
        <Route path="getAllUsers" element={<AllUsersGet />} />
        <Route path="getUser" element={<UserGet />} />
        <Route path="postUser" element={<UserPost />} />
        <Route path="putUser" element={<UserPut />} />
        <Route path="deleteUser" element={<UserDelete />} />
        <Route path="*" element={<Navigate to={'getAllUsers'} />} />
      </Routes>
    </>
  );
};
