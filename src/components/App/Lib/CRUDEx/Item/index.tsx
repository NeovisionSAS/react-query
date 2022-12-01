import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';
import { MeCRUD } from './meCRUD';
import { MeCRUDAuto } from './meCRUDAuto';

export const ItemEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'meCRUD'}>Me CRUD</Link>
        <Link to={'meCRUDAuto'}>Me CRUD Auto</Link>
      </nav>
      <Routes>
        <Route path="meCRUD" element={<MeCRUD />} />
        <Route path="meCRUDAuto" element={<MeCRUDAuto />} />
        <Route path="*" element={<Navigate to={'meCRUD'} />} />
      </Routes>
    </>
  );
};
