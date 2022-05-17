/// <reference types="react" />
import { RequestOptions } from '../../../utils/api';
interface QueryOptions {
    requestMiddleware?: Promise<HeadersInit>;
    domain: string;
    parameterType?: QueryType;
    mode?: 'development' | 'production';
    verbosity?: number;
    idName?: string;
}
export declare type QueryType = 'path' | 'queryString';
export declare const useQueryOptions: () => Required<QueryOptions>;
export declare const useRequest: () => <T = any>(path: string, options?: RequestOptions) => Promise<T>;
export declare const QueryOptionsProvider: import("react").Provider<QueryOptions>;
export {};
