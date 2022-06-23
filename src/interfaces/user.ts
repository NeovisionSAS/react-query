import { NamedEntity } from './common';

export interface User extends NamedEntity {
  age: number;
  nationality: string;
  book?: string;
}
