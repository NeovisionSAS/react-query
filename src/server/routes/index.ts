import { routes as fileRoutes } from './file';
import { routes as userRoutes } from './user';
import { Request, Response } from 'express';
import { table } from 'table';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type MethodArray = {
  [key in Method]: any[];
};

export interface Routable<T = any> {
  path: string;
  method: Method;
  action: (request: Request, response: Response) => Promise<T>;
}

export class Route {
  private static routes: { routes: Routable[]; name: string }[] = [];

  static add(elements: Routable[], name: string) {
    this.routes.push({ name, routes: elements });
  }

  static getAll() {
    return this.routes.reduce<Routable[]>((prev, curr) => {
      curr.routes.forEach((r) => prev.push(r));
      return prev;
    }, []);
  }

  static getRoutes() {
    return this.routes;
  }

  static log() {
    console.log(
      table([
        ['Routes', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        ...Route.getRoutes().map((route) => {
          const obj: MethodArray = {
            GET: [],
            POST: [],
            PUT: [],
            DELETE: [],
            PATCH: [],
          };

          route.routes.forEach((r) => {
            obj[r.method].push(r.path);
          });

          const { GET, POST, PUT, DELETE, PATCH } = obj;

          return [
            route.name,
            GET.toString(),
            POST.toString(),
            PUT.toString(),
            DELETE.toString(),
            PATCH.toString(),
          ];
        }),
      ])
    );
  }
}

Route.add(userRoutes, 'User');
Route.add(fileRoutes, 'File');
Route.add(
  [
    {
      action: (_, response) => {
        response.removeHeader('Access-Control-Allow-Origin');
        response.setHeader('Access-Control-Allow-Credentials', 'true');
        return Promise.resolve('Cors works !');
      },
      method: 'GET',
      path: '/cors',
    },
  ],
  'Cors'
);
