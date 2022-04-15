export const queryLog = (
  mode: 'production' | 'development',
  paramVerbosity: number,
  limitVerbosity: number,
  ...s: any
) => {
  console.log(`[react-query]`, ...s);
};
