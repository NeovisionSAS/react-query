/// <reference types="react" />
interface QueryOptions {
    requestMiddleware?: () => Promise<HeadersInit | undefined>;
    domain: string;
    parameterType?: QueryType;
    mode?: 'development' | 'production';
    verbosity?: number;
}
export declare type QueryType = 'path' | 'queryString';
export declare const useQueryOptions: () => Required<QueryOptions>;
export declare const QueryOptionsProvider: import("react").Provider<QueryOptions>;
export {};
