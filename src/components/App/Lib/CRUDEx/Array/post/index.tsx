import { User as UserInterface } from '../../../../../../interfaces/user';
import { CRUD } from '../../../../../utils';
import { FunctionComponent } from 'react';

export const User: FunctionComponent = () => {
  return (
    <CRUD<UserInterface[]> endPoints={`user`}>
      {({ handleCreate }) => {
        return (
          <form onSubmit={handleCreate}>
            <div>
              <label htmlFor="name">Name *</label>
              <input
                name="name"
                id="name"
                defaultValue={''}
                type="text"
                required
              />
            </div>
            <div>
              <label htmlFor="age">Age *</label>
              <input
                name="age"
                id="age"
                defaultValue={''}
                type="number"
                required
              />
            </div>
            <div>
              <label htmlFor="nationality">Nationality</label>
              <select id="nationality" name="nationality" defaultValue={''}>
                <option value={''}>Please choose an option</option>
                <option value={'french'}>French</option>
                <option value={'english'}>English</option>
              </select>
            </div>
            <button type="submit">Submit</button>
          </form>
        );
      }}
    </CRUD>
  );
};
