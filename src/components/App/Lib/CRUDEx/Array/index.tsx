import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';
import { User as UserDelete } from './delete';
import { AllUsers } from './get';
import { User as UserPost } from './post';
import { User as UserPut } from './put';
import { UserCRUD } from './userCRUD';
import { UserCRUDAuto } from './userCRUDAuto';

export const ArrayEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'userCRUD'}>User CRUD</Link>
        <Link to={'userCRUDAuto'}>User CRUD Auto</Link>
        <Link to={'postUser'}>Post User</Link>
        <Link to={'putUser'}>Put User</Link>
        <Link to={'deleteUser'}>Delete User</Link>
      </nav>
      <Routes>
        <Route path="userCRUD" element={<UserCRUD />} />
        <Route path="userCRUDAuto/*" element={<UserCRUDAuto />} />
        <Route path="getAllUsers" element={<AllUsers />} />
        <Route path="postUser" element={<UserPost />} />
        <Route path="putUser" element={<UserPut />} />
        <Route path="deleteUser" element={<UserDelete />} />
        <Route path="*" element={<Navigate to={'userCRUD'} />} />
      </Routes>
    </>
  );
};
