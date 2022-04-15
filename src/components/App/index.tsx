import '../../scss/main.scss';
import { Test } from '../Test';
import { CRUD, ErrorBoundary } from '../utils';
import { QueryOptionsProvider } from '../utils/QueryOptionsProvider';

function App(): JSX.Element {
  const p = new Promise<HeadersInit | undefined>((resolve) => {
    setTimeout(() => {
      resolve({
        'Content-Type': 'text',
      });
    }, 1000);
  });

  return (
    <ErrorBoundary>
      <QueryOptionsProvider
        value={{
          domain: 'api.publicapis.org',
          parameterType: 'path',
          protocol: 'https',
          requestMiddleware: () => p,
        }}
      >
        <Test />
        <CRUD endPoints={'entries'}>
          {(crud) => {
            const { data, loading } = crud.read;
            if (loading) return <div>Loading..</div>;

            return <div>{JSON.stringify(data)}</div>;
          }}
        </CRUD>
      </QueryOptionsProvider>
    </ErrorBoundary>
  );
}

export default App;
