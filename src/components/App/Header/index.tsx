import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

export const Header: FunctionComponent = () => {
  return (
    <header>
      <Link to={'/query'}>Query</Link>
      <Link to={'/crud'}>CRUD</Link>
      <Link to={'/useRequest'}>UseRequest</Link>
      <Link to={'/useQueryOptions'}>UseQueryOptions</Link>
    </header>
  );
};
