import { backend } from '../config';
import { File } from './orm/file';
import { User } from './orm/user';
import { Route } from './routes';
import cors from 'cors';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const fileUpload = require('express-fileupload');

export const source = new DataSource({
  type: 'sqlite',
  database: 'test.sql',
  synchronize: true,
  logging: true,
  entities: [User, File],
});

source.initialize().then(() => {
  const app = express();
  app.use(
    fileUpload({
      createParentPath: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(cors());

  Route.getAll().forEach((route) => {
    console.log(`Adding route ${route.method} ${route.path}`);
    (app as any)[route.method.toLocaleLowerCase()](
      route.path,
      (request: Request, response: Response, next: Function) => {
        console.log(`${route.method} ${route.path}`);
        route
          .action(request, response)
          .then((d) => response.send(d))
          .catch((e) => {
            console.error(e), response.status(404), response.send(e);
          });
      }
    );
  });

  app.listen(backend.port, () =>
    console.log(`Server started on ${backend.url}`)
  );
});
