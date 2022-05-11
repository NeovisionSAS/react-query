import { Mode } from '../types/global';

export const requestLog = (
  mode: Mode,
  paramVerbosity: number,
  limitVerbosity: number,
  ...s: any
) => {
  if (mode == 'development' && limitVerbosity <= paramVerbosity)
    console.log(`[react-query]`, ...s);
};

export const queryWarn = (
  mode: Mode,
  paramVerbosity: number,
  limitVerbosity: number,
  ...s: any
) => {
  if (mode == 'development' && limitVerbosity <= paramVerbosity)
    console.warn(`[react-query]`, ...s);
};

export const queryError = (...s: any) => {
  console.error(`[react-query]`, ...s);
};
