import { QueryOptionsProvider } from '../utils/QueryOptionsProvider';
import '../../scss/main.scss';
import { CRUD, ErrorBoundary } from '../utils';

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
