import { backend } from '../../config';
import { ErrorBoundary } from '../utils';
import { QueryOptionsProvider } from '../utils/QueryOptionsProvider';
import { Header } from './Header';
import { QueryEx } from './Lib/QueryEx';
import { UseRequestEx } from './Lib/UseRequestEx';
import { CRUDEx } from './Lib/CRUDEx';
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

function App(): JSX.Element {
  const p = () =>
    new Promise<HeadersInit>((resolve) => {
      setTimeout(() => {
        resolve({
          'Content-Type': 'application/json',
        });
      }, 1000);
    });

  return (
    <ErrorBoundary>
      <QueryOptionsProvider
        value={{
          domain: backend.url,
          parameterType: 'queryString',
          mode: 'development',
          requestMiddleware: p,
          verbosity: 10,
        }}
      >
        <Router>
          <Header />
          <Routes>
            <Route path="/query/*" element={<QueryEx />} />
            <Route path="/crud/*" element={<CRUDEx />} />
            <Route path="/useRequest/*" element={<UseRequestEx />} />
            <Route path="/*" element={<Navigate to={`/query`} />} />
          </Routes>
        </Router>
      </QueryOptionsProvider>
    </ErrorBoundary>
  );
}

export default App;
