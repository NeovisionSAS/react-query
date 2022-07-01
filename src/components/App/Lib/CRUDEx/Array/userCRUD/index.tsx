import { User as UserInterface } from '../../../../../../interfaces/user';
import { CRUD } from '../../../../../utils';
import { Fragment, FunctionComponent } from 'react';

export const UserCRUD: FunctionComponent = () => {
  return (
    <CRUD<UserInterface[]> endPoints={`user`}>
      {({
        read: { data: users, loading, error },
        handleCreate,
        handleDelete,
        handleUpdate,
      }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>{error}</div>;

        return (
          <div>
            {users.map(({ id, name, age, nationality }, i) => {
              return (
                <Fragment key={`allUsers-${i}`}>
                  <form onSubmit={handleUpdate}>
                    <div>
                      <label htmlFor="id">ID : </label>
                      <input
                        type={'number'}
                        name="id"
                        defaultValue={id}
                        key={id}
                        disabled
                      />
                    </div>
                    <div>
                      <label htmlFor="name">Name : </label>
                      <input name="name" defaultValue={name} key={name} />
                    </div>
                    <div>
                      <label htmlFor="age">Age : </label>
                      <input
                        type="number"
                        name="age"
                        defaultValue={age}
                        key={age}
                      />
                    </div>
                    <div>
                      <label htmlFor="nationality">Nationality</label>
                      <select
                        name="nationality"
                        defaultValue={nationality}
                        key={nationality}
                      >
                        <option value={''}>Please choose an option</option>
                        <option value={'french'}>French</option>
                        <option value={'english'}>English</option>
                      </select>
                    </div>
                    <button type={'submit'}>Update</button>
                  </form>
                  <form onSubmit={handleDelete}>
                    <input
                      name="id"
                      key={id}
                      defaultValue={id}
                      style={{ display: 'none' }}
                    />
                    <button type={'submit'}>X</button>
                  </form>
                </Fragment>
              );
            })}
            <form onSubmit={(e) => handleCreate(e)}>
              <div>
                <label htmlFor="name">Name *</label>
                <input name="name" defaultValue={''} type="text" required />
              </div>
              <div>
                <label htmlFor="age">Age *</label>
                <input name="age" defaultValue={''} type="number" required />
              </div>
              <div>
                <label htmlFor="nationality">Nationality</label>
                <select name="nationality" defaultValue={''}>
                  <option value={''}>Please choose an option</option>
                  <option value={'french'}>French</option>
                  <option value={'english'}>English</option>
                </select>
              </div>
              <button type="submit">Add user</button>
            </form>
          </div>
        );
      }}
    </CRUD>
  );
};
