import { QueryType } from '../components/utils/QueryOptionsProvider';
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
 * @returns An object of type T by default with key value pairs
 */
export const getFormData = <T = { [key: string]: string | number }>(
  target: EventTarget
): T => {
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
        const { name, value, checked, type, required } = cur;

        const isCheckbox = type == 'checkbox';
        const isValEmpty = value == '' || value == null;

        if (required && isValEmpty)
          throw new Error(`Can't use an empty value for ${name}`);

        let finalValue = type == 'number' ? new Number(value).valueOf() : value;

        return {
          ...acc,
          [name]: isCheckbox ? checked : finalValue,
        };
      }, {}) as T
  );
};

interface FormExtractorData {
  [key: string]: string | number;
}

/**
 * Extracts all the necessary data from the form target
 *
 * @param target Target received from the object event
 * @param {string} name The name that identifies the data
 *
 * @example
 *
 * formExtractor with form inputs
 * ```html
 * <div>
 *  <input name="id-1" />
 *  <input name="address-1" value="2 Harley street" />
 * </div>
 * ...
 * <div>
 *  <input name="id-n" />
 *  <input name="address-n" value="35 rue champs élysées" />
 * </div>
 * ```
 * ```typescript
 * formExtractor(target, ["id"]);
 * // [
 * //  {id: "1", address: "2 Harley street"},
 * //  ...,
 * //  {id: "n", address: "35 rue champs élysées"}
 * // ]
 * ```
 *
 * @returns {FormExtractorData} FormExtracorData
 */
export const formExtractor = (
  target: EventTarget,
  name: string
): FormExtractorData[] => {
  // Get all the data from the form
  const formData = getFormData(target);

  // Simply check if there is no id for each formData
  if (formData[name] != null) return [formData];
  // Each formData is specific to an id
  const values = Object.entries(formData);
  return values.reduce<FormExtractorData[]>((prev, curr) => {
    const key = curr[0];
    const [attr, id] = seperateAndKeepIds([key])[0];

    const elem = prev.find((elem) => elem[name] == id);

    let parseId: number | string = id;
    try {
      parseId = parseInt(id);
    } catch (e) {}

    if (elem) elem[attr] = curr[1];
    else prev.push({ [name]: parseId, [attr]: curr[1] });

    return prev;
  }, []);
};

/**
 * Regroup strings based on their ids represented by the last seperation of the string
 *
 * @example
 *
 * ```typescript
 * seperateAndKeepIds("helloWorld5","hello-world6", "helloWorld7", "helloWorld");
 * // [["helloWorld", "5"], ["hello-world", "6"], ["helloWorld", "7"], ["hello", "World"]]
 * ```
 *
 * @param strs The string array to search for ids and regroup all attributes with the same ids
 * @returns And array of arrays each containing the parsed name and id of the string
 */
export const seperateAndKeepIds = (strs: string[]) => {
  return seperate(strs).map<[string, string]>((v) => {
    const seperated = v[1];
    const id = seperated[seperated.length - 1];
    return [v[0].replace(new RegExp(`(-|_)?${id}$`), ''), id];
  });
};

/**
 * This function seperates strings based on special characters / case
 *
 * @example
 *
 * ```typescript
 * seperate(["hello-world", "helloWorld2", "hello_world_2"])
 * // [
 * //   ["hello-world", ["hello","world"]],
 * //   ["helloWorld2", ["hello","world", "2"]],
 * //   ["hello_world_2", ["hello", "world", "2"]]
 * // ]
 * ```
 *
 * @param strs The string array to try seperate
 * @returns An array of arrays with the input / output strings
 */
export const seperate = (strs: string[]): [string, string[]][] => {
  return strs.map<[string, string[]]>((str) => {
    return [
      str,
      str
        .replace(/([0-9]+)/, ' $1')
        .replace(/(-|_)/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLocaleLowerCase()
        .split(' ')
        .filter((s) => s != ''),
    ];
  });
};

export const getPathTail = (
  data: FormExtractorData,
  type: QueryType,
  name: string,
  pathTail?: string | number
) => {
  const id = data[name];
  if (type == 'path' && id != '' && id != null) {
    return id;
  }
  return pathTail;
};

export const useForceUpdate = (): (() => void) => {
  return useReducer(() => ({}), {})[1] as () => void;
};

export interface Query<T = any> {
  data: T;
  loading: boolean;
  error: string | null;
}
