import { Mode } from '../types/global';

export const ConsoleStyle = {
  base: ['padding: 2px 4px', 'border-radius: 2px', 'font-weight:bold'],
  get info() {
    return [...this.base, 'color: #000', 'background-color: #DDD'].join(';');
  },
  get warning() {
    return [...this.base, 'color: #971', 'background-color: #ED8'].join(';');
  },
  get error() {
    return [...this.base, 'color: #F00', 'background-color: #EBB'].join(';');
  },
};

export const requestLog = (
  mode: Mode,
  paramVerbosity: number,
  limitVerbosity: number,
  ...s: any
) => {
  if (mode == 'development' && limitVerbosity <= paramVerbosity)
    console.warn('%creact-query', ConsoleStyle.warning, ...s);
};

export const queryWarn = (
  mode: Mode,
  paramVerbosity: number,
  limitVerbosity: number,
  ...s: any
) => {
  if (mode == 'development' && limitVerbosity <= paramVerbosity)
    console.warn(`%creact-query`, ConsoleStyle.warning, ...s);
};

export const queryError = (...s: any) => {
  console.error(`%creact-query`, ConsoleStyle.error, ...s);
};
