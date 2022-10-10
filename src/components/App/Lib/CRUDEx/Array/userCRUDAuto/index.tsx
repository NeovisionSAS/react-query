import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';
import { UserCRUDAutoDefault } from './default';
import { UserCRUDAutoInsert } from './insert';

export const UserCRUDAuto: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'default'}>Default</Link>
        <Link to={'insert'}>Insert</Link>
      </nav>
      <Routes>
        <Route path="default" element={<UserCRUDAutoDefault />} />
        <Route path="insert" element={<UserCRUDAutoInsert />} />
        <Route path="*" element={<Navigate to={'default'} />} />
      </Routes>
    </>
  );
};
