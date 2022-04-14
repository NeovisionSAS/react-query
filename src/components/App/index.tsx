import { CRUD, ErrorBoundary } from 'components/utils';
import { QueryOptionsProvider } from 'components/utils/Context';
import 'scss/main.scss';

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <QueryOptionsProvider
        value={{
          domain: 'localhost:8000',
          parameterType: 'path',
          protocol: 'http',
        }}
      >
        <CRUD endPoints={'api/websitesToScrap'}>
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
