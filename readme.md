# @neovision/react-query

**Author** : Alan BLANCHET

## Installation

### SSH

```bash
npm i git+ssh://git@bitbucket.org:neovision/apv11_backend.git
```

### HTTPS (not recommended)

```bash
# username is your bitbucket username
# password is your app password that you can generate on
# https://bitbucket.org/account/settings/app-passwords/
npm i git+https://username:password@bitbucket.org/neovision/react-query.git
```

## Add issues

You can add issues to :
https://neovision-sas.atlassian.net/jira/software/c/projects/RQU/issues

## Examples

### Components

#### Query Options Provider

```jsx
<QueryOptionsProvider
  value={{
    domain: 'https://api.publicapis.org',
    parameterType: 'path',
    mode: 'development',
    requestMiddleware: () => p,
  }}
>
  <CRUD endPoints={'entries'}>
    {(crud) => {
      const { data, loading } = crud.read;
      if (loading) return <div>Loading..</div>;

      return <div>{JSON.stringify(data)}</div>;
    }}
  </CRUD>
</QueryOptionsProvider>
```

##### Value prop

| Value             | Type                                      | description                                                                                                                                               |
| ----------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| domain            | `string`                                  | The domain where the component needs to point to                                                                                                          |
| parameterType     | `"path"` or `"queryString"`               | Where the component should place the `primary key` in requests                                                                                            |
| mode              | `"development"` or `"production"`         | The environment which is used to manage logging                                                                                                           |
| requestMiddleware | `() => Promise<HeadersInit \| undefined>` | Before doing any request, this function is called. It is used if you need some sort of request to get a `token` before sending the real effective request |
| idName            | `string`                                  | The name of the general parameter representing the default `primary key` name to use in request                                                           |

Go to the [QueryOptionsProvider examples directory](https://bitbucket.org/neovision/react-query/src/master/src/examples/QueryOptionsProvider) to see examples

#### Query

With query you can easily access the data you want. The Query object does a GET request for you and lets you know if the data is currently being retrieved (`loading`), if there was an `error` or what the received `data` is. You can type the received data if you want more structure. (for example here `string[]`)

```jsx
// Specify the API endpoint
<Query query={`names/`}>
  {(data: string[], loading, error) => {
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
<CRUD endPoints={`users/`}>
  {(data: CRUDObject<string>) => {
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
