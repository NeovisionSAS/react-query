import { useReducer } from 'react';

type TypedTarget = EventTarget & {
  [key: string]: {
    value: any;
    name: string;
    tagName: string;
    checked: boolean;
    type: string;
    required: boolean;
  };
};

/**
 * getFormData extracts the values of the input elements
 * received from the target object
 * @param target Target received from the object event
 * @returns An object of type T
 */
export const getFormData = <T>(target: EventTarget): T => {
  const typedTarget = target as TypedTarget;
  return (
    Object.keys(target)
      .map((k) => {
        return typedTarget[k];
      })
      // Keep named input and select
      .filter((v) => {
        const tag = v.tagName?.toLocaleLowerCase?.();
        return v.name && (tag == 'input' || tag == 'select');
      })
      .reduce((acc, cur) => {
        const { name, value, tagName, checked, type, required } = cur;

        const isCheckbox = type == 'hidden' && value == '';
        const isValEmpty = value == '' || value == null;

        if (required && isValEmpty)
          throw new Error(`Can't use an empty value for ${name}`);

        return {
          ...acc,
          [name]: isCheckbox ? checked : value,
        };
      }, {}) as T
  );
};

export const useForceUpdate = (): (() => void) => {
  return useReducer(() => ({}), {})[1] as () => void;
};

export interface Query<T = any> {
  data: T;
  loading: boolean;
  error: string | null;
}
