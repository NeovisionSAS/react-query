import { backend } from '../../config';
import { QueryOptions } from '../../utils/api';
import { ErrorBoundary } from '../utils';
import { QueryOptionsProvider } from '../utils/QueryOptionsProvider';
import { Header } from './Header';
import { CRUDEx } from './Lib/CRUDEx';
import { QueryEx } from './Lib/QueryEx';
import { UseQueryOptionsEx } from './Lib/UseQueryOptionsEx';
import { UseRequestEx } from './Lib/UseRequestEx';
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

function App(): JSX.Element {
  const storageQueryOptions = JSON.parse(
    localStorage.getItem(`queryOptions`) ?? '{}'
  );

  return (
    <ErrorBoundary>
      <QueryOptionsProvider
        value={Object.merge<QueryOptions>(
          {
            domain: backend.url,
            parameterType: 'queryString',
            mode: 'development',
            verbosity: 10,
            onRejected(rej) {
              console.error('Received rejection', rej);
            },
            headers: () =>
              new Promise((resolve) => resolve({ customHeader: 'true' })),
          },
          storageQueryOptions
        )}
      >
        <Router>
          <Header />
          <Routes>
            <Route path="/query/*" element={<QueryEx />} />
            <Route path="/crud/*" element={<CRUDEx />} />
            <Route path="/useRequest/*" element={<UseRequestEx />} />
            <Route path="/useQueryOptions/*" element={<UseQueryOptionsEx />} />
            <Route path="/*" element={<Navigate to={`/query`} />} />
          </Routes>
        </Router>
      </QueryOptionsProvider>
    </ErrorBoundary>
  );
}

export default App;
