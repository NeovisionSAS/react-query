import { User as UserDelete } from './delete';
import { AllUsers } from './get';
import { User as UserPost } from './post';
import { User as UserPut } from './put';
import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';

export const ArrayEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'getAllUsers'}>Get All Users</Link>
        <Link to={'postUser'}>Post User</Link>
        <Link to={'putUser'}>Put User</Link>
        <Link to={'deleteUser'}>Delete User</Link>
      </nav>
      <Routes>
        <Route path="getAllUsers" element={<AllUsers />} />
        <Route path="postUser" element={<UserPost />} />
        <Route path="putUser" element={<UserPut />} />
        <Route path="deleteUser" element={<UserDelete />} />
        <Route path="*" element={<Navigate to={'getAllUsers'} />} />
      </Routes>
    </>
  );
};
