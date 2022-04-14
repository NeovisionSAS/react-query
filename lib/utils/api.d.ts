export declare type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE';
interface SetDataOptions {
    middleware?: Promise<HeadersInit | undefined>;
    method?: Method;
    body?: string;
}
export declare const setData: <T = any>(domain: string, path: string, options?: SetDataOptions) => Promise<T>;
export {};
