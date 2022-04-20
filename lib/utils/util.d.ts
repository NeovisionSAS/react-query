import { QueryType } from '../components/utils/QueryOptionsProvider';
/**
 * getFormData extracts the values of the input elements
 * received from the target object
 * @param target Target received from the object event
 * @returns An object of type T by default with key value pairs
 */
export declare const getFormData: <T = {
    [key: string]: string | number;
}>(target: EventTarget) => T;
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
export declare const formExtractor: (target: EventTarget, name: string) => FormExtractorData[];
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
export declare const seperateAndKeepIds: (strs: string[]) => [string, string][];
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
export declare const seperate: (strs: string[]) => [
    string,
    string[]
][];
export declare const getPathTail: (data: FormExtractorData, type: QueryType, name: string, pathTail?: string | number | undefined) => string | number | undefined;
export declare const useForceUpdate: () => (() => void);
export interface Query<T = any> {
    data: T;
    loading: boolean;
    error: string | null;
}
export {};
