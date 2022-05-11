import { request } from '../../utils/api';

request('mydomain.com', 'users/names').then((text) => {
  console.log(text);
});

request('mydomain.com', 'users/changeName/1', {
  method: 'POST',
  body: JSON.stringify({ name: 'Gerald' }),
  headers: Promise.resolve({ 'Content-Type': 'application/json' }),
}).then((json) => {
  console.log(json);
});

request('mydomain.com', 'users/delete/1', {
  method: 'DELETE',
})
  .then((res) => {
    console.log('User deleted');
  })
  .catch((err) => {
    console.error('Cannot delete user 1', err);
  });
