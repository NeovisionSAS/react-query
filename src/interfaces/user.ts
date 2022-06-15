import { NamedEntity } from 'interfaces/common';

export interface User extends NamedEntity {
  age: number;
  nationality: string;
}
