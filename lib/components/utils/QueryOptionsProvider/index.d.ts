/// <reference types="react" />
import { RequestOptions } from '../../../utils/api';
interface QueryOptions {
    requestMiddleware?: () => Promise<HeadersInit>;
    domain: string;
    parameterType?: QueryType;
    mode?: 'development' | 'production';
    verbosity?: number;
    idName?: string;
    onRejected?: (res: Response) => any;
}
export declare type QueryType = 'path' | 'queryString';
export declare const useQueryOptions: () => Required<QueryOptions>;
export declare const useRequest: ({ body: rBody, headers: rHeaders, method: rMethod, mode: rMode, onRejected: rOnRejected, signal: rSignal, }?: RequestOptions) => <T = any>(path: string, options?: RequestOptions) => Promise<T>;
export declare const QueryOptionsProvider: import("react").Provider<QueryOptions>;
export {};
