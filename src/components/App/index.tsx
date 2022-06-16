import { ErrorBoundary } from '../utils';
import { QueryOptionsProvider } from '../utils/QueryOptionsProvider';
import { Header } from 'components/App/Header';
import { QueryEx } from 'components/App/Lib/QueryEx';
import { UseRequestEx } from 'components/App/Lib/UseRequestEx';
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { backend } from 'src/config';

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
            <Route path="/useRequest/*" element={<UseRequestEx />} />
            <Route path="/*" element={<Navigate to={`/query`} />} />
          </Routes>
        </Router>
      </QueryOptionsProvider>
    </ErrorBoundary>
  );
}

export default App;
