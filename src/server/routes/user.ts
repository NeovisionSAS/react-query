import { UserResolver } from '../resolver';
import { Routable } from './';

export const routes: Routable[] = [
  {
    method: 'GET',
    path: '/user',
    action(request, response) {
      const { id } = request.query;
      if (id)
        return UserResolver.read(parseInt(id as string), {
          request,
          response,
        });
      return UserResolver.readAll();
    },
  },
  {
    method: 'POST',
    path: '/user',
    action({ body: { name, age, nationality, book, dateOfBirth } }, response) {
      return UserResolver.create(
        name,
        parseInt(age),
        nationality,
        book,
        dateOfBirth
      );
    },
  },
  {
    method: 'DELETE',
    path: '/user',
    action(request, response) {
      return UserResolver.delete(parseInt(request.body.id));
    },
  },
  {
    method: 'PUT',
    path: '/user',
    action(
      { body: { id, name, age, nationality, book, dateOfBirth } },
      response
    ) {
      return UserResolver.update(
        parseInt(id),
        name,
        parseInt(age),
        nationality,
        book,
        dateOfBirth
      );
    },
  },
  {
    method: 'GET',
    path: '/user/book',
    action(request, response) {
      return UserResolver.readUserBook(parseInt(request.body.id));
    },
  },
  {
    method: 'GET',
    path: '/user/auth',
    action(request, response) {
      response.status(401);
      throw new Error('User not authorized on this url');
      return Promise.resolve({ ok: true });
    },
  },
  {
    method: 'POST',
    path: '/user/get',
    action(request, response) {
      const { id } = request.body;
      if (id != undefined)
        return UserResolver.read(parseInt(id as string), {
          request,
          response,
        });
      return UserResolver.readAll();
    },
  },
];
