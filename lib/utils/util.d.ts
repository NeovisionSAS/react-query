/**
 * getFormData extracts the values of the input elements
 * received from the target object
 * @param target Target received from the object event
 * @returns An object of type T
 */
export declare const getFormData: <T>(target: EventTarget) => T;
export declare const useForceUpdate: () => (() => void);
export interface Query<T = any> {
    data: T;
    loading: boolean;
    error: string | null;
}
