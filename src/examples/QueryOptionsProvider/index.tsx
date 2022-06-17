import { Query, QueryOptionsProvider } from '../../module';

<QueryOptionsProvider
  value={{
    domain: 'mydomain.com',
    mode: 'development',
    idName: 'id',
    headers: () =>
      new Promise((res, rej) => {
        console.log('A request is about to be done by react-query');
        return fetch('authorizationToken').then((token) => {
          try {
            console.log('Auth token received', token);
            // Now that we have the token, put it in the header and return the header
            res({
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            });
          } catch (e) {
            rej(e);
          }
        });
      }),
  }}
>
  <Query query={`users`}>
    {({ data, loading }) => {
      if (loading) return <div>Loading...</div>;
      return <div>{data}</div>;
    }}
  </Query>
</QueryOptionsProvider>;
