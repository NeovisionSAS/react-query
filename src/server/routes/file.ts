import { FileResolver } from '../resolver/file';
import { Routable } from './';
import { UploadedFile } from 'express-fileupload';

export const routes: Routable[] = [
  {
    method: 'GET',
    path: '/file',
    action() {
      return FileResolver.readAllNames();
    },
  },
  {
    method: 'POST',
    path: '/file',
    action(request, response) {
      if (!request.files) {
        response.status(400);
        throw new Error('No file was found');
      }
      const file = request.files['file'] as UploadedFile;
      return FileResolver.create(file, {
        request,
        response,
      });
    },
  },
];
