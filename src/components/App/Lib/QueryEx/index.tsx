import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';
import {
  AllUsers as AllUsersGet,
  AllUsersDelay as AllUsersDelayGet,
  Auth as AuthGet,
  Files as FilesGet,
  User as UserGet,
  UserBook as UserBookGet,
} from './get';
import { PostAllUsers, PostUser } from './post';

export const QueryEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'getAllUsers'}>Get All Users</Link>
        <Link to={'getUser'}>Get User</Link>
        <Link to={'getAllUsersDelay'}>Get All Users Delay</Link>
        <Link to={'getUserBook'}>Get User Book</Link>
        <Link to={'getFiles'}>Get User Files</Link>
        <Link to={'authGet'}>Get Auth</Link>
        <Link to={'postUser'}>Post User</Link>
        <Link to={'postAllUsers'}>Post All Users</Link>
      </nav>
      <Routes>
        <Route path="getAllUsers" element={<AllUsersGet />} />
        <Route path="getUser" element={<UserGet />} />
        <Route path="getAllUsersDelay" element={<AllUsersDelayGet />} />
        <Route path="getUserBook" element={<UserBookGet />} />
        <Route path="getFiles" element={<FilesGet />} />
        <Route path="authGet" element={<AuthGet />} />
        <Route path="postUser" element={<PostUser />} />
        <Route path="postAllUsers" element={<PostAllUsers />} />
        <Route path="*" element={<Navigate to={'getAllUsers'} />} />
      </Routes>
    </>
  );
};
