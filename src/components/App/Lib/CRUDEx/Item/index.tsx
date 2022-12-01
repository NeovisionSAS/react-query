import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Me } from './me';

export const ItemEx: FunctionComponent = () => {
  return (
    <Routes>
      <Route path="me" element={<Me />} />
      <Route path="*" element={<Navigate to={'me'} />} />
    </Routes>
  );
};
