import { ArrayEx } from './Array';
import { FunctionComponent } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';

export const CRUDAutoEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'array'}>Array</Link>
      </nav>
      <Routes>
        <Route path="array/*" element={<ArrayEx />} />
        <Route path="*" element={<Navigate to={'array'} />} />
      </Routes>
    </>
  );
};
