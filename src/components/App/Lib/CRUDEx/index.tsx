import { ArrayEx } from './Array';
import { ItemEx } from './Item';
import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';

export const CRUDEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'array'}>Array</Link>
        <Link to={'item'}>Item</Link>
      </nav>
      <Routes>
        <Route path="array/*" element={<ArrayEx />} />
        <Route path="item/*" element={<ItemEx />} />
        <Route path="*" element={<Navigate to={'array'} />} />
      </Routes>
    </>
  );
};
