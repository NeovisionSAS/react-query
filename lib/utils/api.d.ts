import { PartialBy, RequiredBy } from '../types/global';
import { FormEvent } from 'react';
export declare type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
export declare type QueryType = 'path' | 'queryString';
interface LoaderOptions {
    loader?: JSX.Element;
    autoload?: boolean;
}
export interface BaseQueryOptions {
    headers?: () => Promise<HeadersInit>;
    parameterType?: QueryType;
    mode?: 'development' | 'production';
    verbosity?: number;
    idName?: string;
    onRejected?: (res: Response) => any;
    delay?: number;
}
export declare type RequestData = string | FormEvent | FormData;
export interface RequestOptions extends BaseQueryOptions {
    method?: Method;
    data?: RequestData;
    signal?: AbortSignal;
}
interface Domain {
    domain: string;
}
export interface QueryOptions extends BaseQueryOptions, Domain {
    loader?: LoaderOptions;
}
export declare type RealQueryOptions = RequiredBy<QueryOptions, 'mode' | 'verbosity' | 'parameterType' | 'idName'>;
export declare type RequestOptionsWithDomain = RequestOptions & Domain;
export declare type RequestOptionsWithOptionalDomain = PartialBy<RequestOptionsWithDomain, 'domain'>;
export declare const request: <T = any>(domain: string, path: string, options?: RequestOptions) => Promise<T>;
export {};
