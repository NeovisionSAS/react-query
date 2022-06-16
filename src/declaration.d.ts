declare module '*.scss';

interface ObjectConstructor {
  merge: <T = object>(...objects: T[]) => T | undefined;
}
