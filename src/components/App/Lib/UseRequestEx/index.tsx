import { ProviderValues } from './provider';
import { File as FilePost } from './post';
import { FunctionComponent } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';

export const UseRequestEx: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'postFile'}>Post File</Link>
        <Link to={'providerValues'}>Provider Values</Link>
      </nav>
      <Routes>
        <Route path="postFile" element={<FilePost />} />
        <Route path="providerValues" element={<ProviderValues />} />
        <Route path="*" element={<Navigate to={'postFile'} />} />
      </Routes>
    </>
  );
};
