import { Request, Response } from 'express';
export interface Routable<T = any> {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    action: (request: Request, response: Response) => Promise<T>;
}
export declare class Route {
    private static routes;
    static add(elements: Routable[]): void;
    static getAll(): Routable<any>[];
}
