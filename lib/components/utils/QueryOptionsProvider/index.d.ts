/// <reference types="react" />
import { RequestOptions } from '../../../utils/api';
interface QueryOptions {
    requestMiddleware?: () => Promise<HeadersInit | undefined>;
    domain: string;
    parameterType?: QueryType;
    mode?: 'development' | 'production';
    verbosity?: number;
    idName?: string;
}
export declare type QueryType = 'path' | 'queryString';
export declare const useQueryOptions: () => Required<QueryOptions>;
export declare const useRequest: () => (path: string, options?: RequestOptions) => Promise<any>;
export declare const QueryOptionsProvider: import("react").Provider<QueryOptions>;
export {};
