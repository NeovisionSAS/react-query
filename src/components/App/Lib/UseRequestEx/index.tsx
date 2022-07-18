import { Cors } from './cors';
import { File as FilePost } from './post';
import { ProviderValues } from './provider';
import { FunctionComponent } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';

export const UseRequestEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'postFile'}>Post File</Link>
        <Link to={'providerValues'}>Provider Values</Link>
        <Link to={'cors'}>Cors</Link>
      </nav>
      <Routes>
        <Route path="postFile" element={<FilePost />} />
        <Route path="providerValues" element={<ProviderValues />} />
        <Route path="cors" element={<Cors />} />
        <Route path="*" element={<Navigate to={'postFile'} />} />
      </Routes>
    </>
  );
};
