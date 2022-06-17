import { FileResolver } from '../resolver/file';
import { Routable } from './';

export const routes: Routable[] = [
  {
    method: 'POST',
    path: '/file',
    action(request, response) {
      return FileResolver.create(
        request.body.name,
        (request.files as any).file
      );
    },
  },
];
