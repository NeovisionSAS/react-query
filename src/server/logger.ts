import {
  AdvancedConsoleLogger,
  Logger,
  LoggerOptions,
  QueryRunner,
} from 'typeorm';

export class TypeORMLogger extends AdvancedConsoleLogger implements Logger {
  constructor(options?: LoggerOptions) {
    super(options);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    super.logQuery(query, [], queryRunner);
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    super.logQueryError(error, query, [], queryRunner);
  }
}
