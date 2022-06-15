import cors from 'cors';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { backend } from 'src/config';
import { User } from 'src/server/orm/user';
import { Route } from 'src/server/routes';
import { DataSource } from 'typeorm';

export const source = new DataSource({
  type: 'sqlite',
  database: 'test.sql',
  synchronize: true,
  logging: true,
  entities: [User],
});

source.initialize().then(() => {
  const app = express();
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
            console.error(e), response.status(400), response.send(e);
          });
      }
    );
  });

  app.listen(backend.port, () =>
    console.log(`Server started on ${backend.url}`)
  );
});
