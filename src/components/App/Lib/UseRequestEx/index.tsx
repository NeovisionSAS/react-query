import { ProviderValues } from './provider';
import { FunctionComponent } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';

export const UseRequestEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'providerValues'}>Provider Values</Link>
      </nav>
      <Routes>
        <Route path="providerValues" element={<ProviderValues />} />
        <Route path="*" element={<Navigate to={'providerValues'} />} />
      </Routes>
    </>
  );
};
