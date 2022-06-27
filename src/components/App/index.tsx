import { backend } from '../../config';
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
  const headerDelay = 0;

  // const p = () =>
  //   new Promise<HeadersInit>((resolve) => {
  //     setTimeout(() => {
  //       resolve();
  //     }, headerDelay);
  //   });

  return (
    <ErrorBoundary>
      <QueryOptionsProvider
        value={{
          domain: backend.url,
          parameterType: 'queryString',
          mode: 'development',
          verbosity: 10,
        }}
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
