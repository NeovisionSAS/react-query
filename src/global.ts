const isObject = (obj: any) => obj && typeof obj === 'object';

const deepMergeInner = (target: any, source: any, memoizer: any[] = []) => {
  Object.keys(source).forEach((key: string) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (
      isObject(targetValue) &&
      isObject(sourceValue) &&
      !memoizer.includes(targetValue)
    ) {
      memoizer.push(targetValue);
      target[key] = deepMergeInner(
        Object.assign({}, targetValue),
        sourceValue,
        memoizer
      );
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
};

Object.merge = <T, R extends T = T>(...objects: T[]): R => {
  if (objects.length < 2) {
    throw new Error(
      'Merge: this function expects at least 2 objects to be provided'
    );
  }

  if (objects.some((object) => !isObject(object))) {
    throw new Error('Merge: all values should be of type "object"');
  }

  const target = {};
  let source: any;

  while ((source = objects.shift())) {
    deepMergeInner(target, source);
  }

  return target as R;
};

Object.exclude = <T = any>(object: T, key: string) => {
  delete (object as any)[key];
  return object;
};
