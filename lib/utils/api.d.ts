import { Mode } from "../types/global";
export declare type Method = "POST" | "PUT" | "PATCH" | "DELETE" | "GET";
export interface RequestOptions {
    headers?: () => Promise<HeadersInit>;
    method?: Method;
    body?: string;
    mode?: Mode;
    signal?: AbortSignal;
    onRejected?: (res: Response) => any;
}
export interface ExtendedRequestOptions extends RequestOptions {
    domain?: string;
}
export declare const request: <T = any>(domain: string, path: string, options?: RequestOptions) => Promise<T>;
