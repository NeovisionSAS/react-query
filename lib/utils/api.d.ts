import { Mode } from '../types/global';
export declare type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
export interface RequestOptions {
    headers?: Promise<HeadersInit | undefined>;
    method?: Method;
    body?: string;
    mode?: Mode;
    signal?: AbortSignal;
}
export declare const request: <T = any>(domain: string, path: string, options?: RequestOptions) => Promise<T>;
