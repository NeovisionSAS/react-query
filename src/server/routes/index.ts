import { routes as userRoutes } from './user';
import { Request, Response } from 'express';

export interface Routable<T = any> {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  action: (request: Request, response: Response) => Promise<T>;
}

export class Route {
  private static routes: Routable[] = [];

  static add(elements: Routable[]) {
    this.routes.push(...elements);
  }

  static getAll() {
    return this.routes;
  }
}

Route.add(userRoutes);
