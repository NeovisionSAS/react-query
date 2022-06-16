import {
  Provider,
  ProviderOverride,
} from './provider';
import { FunctionComponent } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';

export const UseQueryOptionsEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'provider'}>Provider Values</Link>
        <Link to={'providerOverride'}>Provider Override Values</Link>
      </nav>
      <Routes>
        <Route path="provider" element={<Provider />} />
        <Route path="providerOverride" element={<ProviderOverride />} />
        <Route path="*" element={<Navigate to={'provider'} />} />
      </Routes>
    </>
  );
};
