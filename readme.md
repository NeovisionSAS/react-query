# @neovision/react-query

**Author** : Alan BLANCHET

## Installation

### NPM

```bash
npm i @neovision/react-query
```

## Add issues

You can add issues to :
https://github.com/NeovisionSAS/react-query/issues

## Examples

### Components

#### Query Options Provider

```tsx
<QueryOptionsProvider
  value={{
    domain: 'https://api.publicapis.org',
    parameterType: 'path',
    mode: 'development',
    headers: () => promiseReturningHeader,
  }}
>
  <CRUD endPoints={'entries'}>
    {({ read }) => {
      const { data, loading } = read;
      if (loading) return <div>Loading..</div>;

      return <div>{JSON.stringify(data)}</div>;
    }}
  </CRUD>
</QueryOptionsProvider>
```

##### Value prop

| Value         | Type                                      | description                                                                                                                                               |
| ------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| domain        | `string`                                  | The domain where the component needs to point to                                                                                                          |
| parameterType | `"path"` or `"queryString"`               | Where the component should place the `primary key` in requests                                                                                            |
| mode          | `"development"` or `"production"`         | The environment which is used to manage logging                                                                                                           |
| headers       | `() => Promise<HeadersInit \| undefined>` | Before doing any request, this function is called. It is used if you need some sort of request to get a `token` before sending the real effective request |
| idName        | `string`                                  | The name of the general parameter representing the default `primary key` name to use in request                                                           |

Go to the [QueryOptionsProvider examples directory](https://github.com/NeovisionSAS/react-query/tree/main/src/examples/QueryOptionsProvider) to see examples

#### Query

With query you can easily access the data you want. The Query object does a GET request for you and lets you know if the data is currently being retrieved (`loading`), if there was an `error` or what the received `data` is. You can type the received data if you want more structure. (for example here `string[]`)

```jsx
// Specify the API endpoint
<Query<string[]> query={`names/`}>
  {({data, loading, error}) => {
    // When the data is being retrieved
    if (loading) return <div>Loading ...</div>;
    // If an error occured
    if (error)
      return (
        <div>
          <div>Oops, there was an error</div>
          <div>{error}</div>
        </div>
      );

    // Whenever the data has been received
    return <div>{data}</div>;
  }}
</Query>
```

#### CRUD

The CRUD component is one of the best since it can handle all API operations and do it all in the background. It will give you, just like the `Query` component, an interface the retrieve the data and also some helper function to place in the `onSubmit` event of forms to `create`, `update` or `delete` the object

```tsx
<CRUD<string> endPoints={`users/`}>
  {({ data }) => {
    const { read, handleUpdate } = data;
    if (read.loading) return <div>Loading...</div>;

    // On submit, the form will send a PUT request
    // { "name": "Gerald" } to the endpoint "server/endpoint/1/"
    // or
    // { "primary_key": 1, "name": "Gerald" } to the endpoint "server/endpoint/"
    // Depending on the parameterType of the QueryOptionsProvider ("path" or "queryString")
    return (
      <form
        onSubmit={(e) =>
          handleUpdate(e, { method: 'PUT', name: 'primary_key' })
        }
      >
        <input type={`number`} name={`primary_key`} value={1} />
        <input name="name" value={`Gerald`} />
      </form>
    );
  }}
</CRUD>
```

Go to the [QueryOptionsProvider examples directory](https://github.com/NeovisionSAS/react-query/tree/main/src/examples/CRUD) to see examples

### Functions

#### request

The `request` function returns a promise with the data received from the endpoint.

Here is a quick example to show you how to use the `request` function :

```ts
request('mydomain.com', 'users/names').then((text) => {
  console.log(text);
});
```

`request` takes the `domain` as a first parameter, the `path` on the domain as a second parameter and finaly an options object to customize the request for your needs.

#### useRequest

You might most commonly use the `useRequest` hook since it will also retreive the data you passed to the `QueryOptionsProvider` component :

```tsx
const UserList: FunctionComponent = () => {
  const [users, setUsers] = useState<any[]>();
  const request = useRequest();

  useEffect(() => {
    request('/users').then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <div>
      {users?.map((user: any) => {
        return <p>user.name</p>;
      })}
    </div>
  );
};
```

Unlike before, you don't need to pass the `domain` we already can detect which domain it is from the `Provider`. It enables to follow the [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle

Here are the available attributes used by the options object :

| Value   | Type                                                | description                                                                          |
| ------- | --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| headers | `Promise<HeadersInit \| undefined>`                 | A promise returning a headers object                                                 |
| method  | `"GET"`, `"POST"`, `"PUT"`, `"PATCH"` or `"DELETE"` | The methods used in the requests to identify what you are trying to do on the server |
| body    | `string`                                            | The content that you want to send to the server                                      |
| mode    | `"development"` or `"production"`                   | Weither you are running in `development` or in `production`                          |
| signal  | `AbortSignal` or `undefined`                        | Send a signal to the request to stop it if you don't need the response anymore       |
