import { FunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';
import { UserCRUDAutoCustom } from './custom';
import { UserCRUDAutoDefault } from './default';
import { UserCRUDAutoEvents } from './events';
import { UserCRUDAutoInsert } from './insert';

export const UserCRUDAuto: FunctionComponent = () => {
  return (
    <>
      <nav>
        <Link to={'default'}>Default</Link>
        <Link to={'insert'}>Insert</Link>
        <Link to={'custom'}>Custom</Link>
        <Link to={'events'}>Events</Link>
      </nav>
      <Routes>
        <Route path="custom" element={<UserCRUDAutoCustom />} />
        <Route path="default" element={<UserCRUDAutoDefault />} />
        <Route path="events" element={<UserCRUDAutoEvents />} />
        <Route path="insert" element={<UserCRUDAutoInsert />} />
        <Route path="*" element={<Navigate to={'default'} />} />
      </Routes>
    </>
  );
};
