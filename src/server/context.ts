import { Request, Response } from 'express';

export interface Context {
  request: Request;
  response: Response;
}
