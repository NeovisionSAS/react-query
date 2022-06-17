import { UserResolver } from '../resolver';
import { Routable } from './';

export const routes: Routable[] = [
  {
    method: 'GET',
    path: '/user',
    action(request, response) {
      const { id } = request.query;
      if (id) return UserResolver.read(parseInt(id as string));
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
];
