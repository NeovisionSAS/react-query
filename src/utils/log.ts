export const queryLog = (
  mode: 'production' | 'development',
  paramVerbosity: number,
  limitVerbosity: number,
  ...s: any
) => {
  if (mode == 'development' && limitVerbosity <= paramVerbosity)
    console.log(`[react-query]`, ...s);
};
