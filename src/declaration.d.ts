declare module '*.scss';

interface ObjectConstructor {
  merge: <T = object, R extends T = T>(...objects: T[]) => R;
}
