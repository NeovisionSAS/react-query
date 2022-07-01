declare module '*.scss';

interface ObjectConstructor {
  merge: <T = object, R extends T = T>(...objects: T[]) => R;
  exclude: <T>(o: T, key: string) => T;
}

interface String {
  capitalize(): string;
}
