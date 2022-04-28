import { CRUD, CRUDObject } from '../../components/utils';

<CRUD endPoints={`users/`}>
  {(data: CRUDObject<string>) => {
    const { read, handleCreate, handleUpdate, handleDelete } = data;
    if (read.loading) return <div>Loading...</div>;

    return (
      <>
        <form onSubmit={handleCreate}></form>
        <form onSubmit={handleUpdate}></form>
        <form onSubmit={handleDelete}></form>
      </>
    );
  }}
</CRUD>;

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
</CRUD>;

<CRUD endPoints={`users/`}>
  {(userCrud: CRUDObject<{ id: number; name: string }[]>) => {
    const { read, handleUpdate } = userCrud;
    if (read.loading) return <div>Loading...</div>;
    const { data: users } = read;
    return (
      <form onSubmit={(e) => handleUpdate(e, { method: 'PUT' })}>
        {users.map((user) => {
          // It is important to give the attribute `name` with the value {attr}-{pk} like in this example.
          // You can replace the seperation with a " " or "_" if you want.
          return (
            <div>
              <input type={`number`} name={`id-${user.id}`} value={user.id} />
              <input name={`name-${user.id}`} value={`Gerald`} />
            </div>
          );
        })}
        <button type="submit">Send</button>
      </form>
    );
  }}
</CRUD>;
