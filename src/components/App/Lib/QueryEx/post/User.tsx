import { CRUD } from 'components/utils';
import { User as UserInterface } from 'interfaces/user';
import { FunctionComponent } from 'react';

export const User: FunctionComponent = () => {
  return (
    <CRUD<UserInterface[]> endPoints={`user`}>
      {({ read: { data, loading, error }, handleCreate }) => {
        if (loading) return <div>Loading...</div>;

        return <form onSubmit={handleCreate}>FORM</form>;
      }}
    </CRUD>
  );
};
