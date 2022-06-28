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
    action(request, response) {
      return UserResolver.create(
        request.body.name,
        parseInt(request.body.age),
        request.body.nationality
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
    action(request, response) {
      return UserResolver.update(
        parseInt(request.body.id),
        request.body.name,
        parseInt(request.body.age),
        request.body.nationality
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
];
