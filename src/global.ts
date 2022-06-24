const isObject = (obj: any) => obj && typeof obj === 'object';

function deepMergeInner(target: any, source: any) {
  Object.keys(source).forEach((key: string) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = deepMergeInner(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}

Object.merge = <T>(...objects: T[]) => {
  if (objects.length < 2) {
    throw new Error(
      'Merge: this function expects at least 2 objects to be provided'
    );
  }

  if (objects.some((object) => !isObject(object))) {
    throw new Error('Merge: all values should be of type "object"');
  }

  const target = objects.shift();
  let source: any;

  while ((source = objects.shift())) {
    deepMergeInner(target, source);
  }

  return target;
};
