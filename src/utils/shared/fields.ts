import { RelationOptions } from 'typeorm';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';

export interface FieldOptions
  extends Pick<ColumnCommonOptions, 'generated'>,
    Pick<RelationOptions, 'cascade'> {
  type: 'number' | 'string' | 'boolean';
  defaultValue?: any;
  description?: string;
  required?: boolean;
  primary?: boolean;
  length?: number;
  precision?: number;
  unique?: boolean;
}

class User {
  static getAll() {}
}
