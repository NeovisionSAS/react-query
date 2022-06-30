import { Mode } from '../types/global';

export const ConsoleStyle = {
  base: [
    'padding: 2px 4px',
    'border-radius: 2px',
    'font-weight:900',
    'text-shadow: #FFFA 0 0 1px',
  ],
  get info() {
    return [
      ...this.base,
      'color: #888',
      'background-color: #9995',
      'mix-blend-mode: difference',
      'border: 1px solid #9996',
    ].join(';');
  },
  get warning() {
    return [...this.base, 'color: #971', 'background-color: #ED8'].join(';');
  },
  get error() {
    return [
      ...this.base,
      'color: #844',
      'background-color: #EBB8',
      'border: 1px solid #8336',
    ].join(';');
  },
};

export const requestLog = (
  mode: Mode,
  paramVerbosity: number,
  limitVerbosity: number,
  ...s: any
) => {
  if (mode == 'development' && limitVerbosity <= paramVerbosity)
    console.log('%creact-query', ConsoleStyle.info, ...s);
};

export const requestWarn = (
  mode: Mode,
  paramVerbosity: number,
  limitVerbosity: number,
  ...s: any
) => {
  if (mode == 'development' && limitVerbosity <= paramVerbosity)
    console.warn(`%creact-query`, ConsoleStyle.warning, ...s);
};

export const requestError = (...s: any) => {
  console.error(`%creact-query`, ConsoleStyle.error, ...s);
};
