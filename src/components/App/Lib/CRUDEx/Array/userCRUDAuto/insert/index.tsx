import { FunctionComponent } from 'react';
import { User } from '../../../../../../../interfaces';
import { asFormTypes } from '../../../../../../../utils/form';
import { CRUDAuto } from '../../../../../../utils/CRUDAuto';
import style from './index.module.scss';

const userType = asFormTypes({
  id: { required: true, visible: false, pk: true, type: 'number' },
  name: { required: true },
  age: { required: true, type: 'number' },
  nationality: {
    select: {
      options: ['Francaise', 'Anglaise', 'Quebequoise'].map((n) => ({
        value: n,
      })),
    },
  },
  dateOfBirth: {
    type: 'date',
    name: 'Date of birth',
    required: true,
  },
});

export const UserCRUDAutoInsert: FunctionComponent = () => {
  return (
    <CRUDAuto<User, typeof userType> endPoints={'user'} type={userType}>
      {({ getForm }) => {
        return (
          <div>
            <h1>CREATE</h1>
            {getForm('create', {
              insert: [
                {
                  type: 'before',
                  search: 'name',
                  element: () => <div>I am before name</div>,
                },
                {
                  type: 'after',
                  search: 'name',
                  element: () => <div>I am after name</div>,
                },
              ],
            })}
            <h1>UPDATE</h1>
            {getForm('update', {
              className: style.main,
              insert: [
                {
                  type: 'before',
                  search: 'name',
                  element: () => <div>I am before name</div>,
                },
                {
                  type: 'after',
                  search: 'name',
                  element: () => <div>I am after name</div>,
                },
              ],
            })}
          </div>
        );
      }}
    </CRUDAuto>
  );
};

// Delete action
