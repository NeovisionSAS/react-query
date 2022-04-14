import { Test } from '../Test';
import '../../scss/main.scss';
import { CRUD, ErrorBoundary } from '../utils';
import { QueryOptionsProvider } from '../utils/QueryOptionsProvider';

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <QueryOptionsProvider
        value={{
          domain: 'google.fr',
          parameterType: 'path',
          protocol: 'https',
        }}
      >
        <Test />
        <CRUD endPoints={''}>
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
