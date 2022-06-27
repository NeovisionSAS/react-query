import { backend } from '../config';
import { TypeORMLogger } from './logger';
import { File } from './orm/file';
import { User } from './orm/user';
import { Route } from './routes';
import bodyParser from 'body-parser';
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
  logger: new TypeORMLogger(true),
});

source.initialize().then(() => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(fileUpload({ useTempFiles: true }));
  app.use(cors());

  const error = (e: any, response: Response) => {
    if (response.statusCode == 200) response.status(400);
    console.error(e), response.send(e);
  };

  Route.log();

  Route.getAll().forEach((route) => {
    (app as any)[route.method.toLocaleLowerCase()](
      route.path,
      (request: Request, response: Response, next: Function) => {
        console.log(`${route.method} ${route.path}`);
        try {
          route
            .action(request, response)
            .then((d) => response.send(d))
            .catch((e) => error(e, response));
        } catch (e) {
          error(e, response);
        }
      }
    );
  });

  app.listen(backend.port, () =>
    console.log(`Server started on ${backend.url}`)
  );
});
