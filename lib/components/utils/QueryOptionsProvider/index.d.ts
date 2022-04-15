/// <reference types="react" />
interface QueryOptions {
    requestMiddleware?: () => Promise<HeadersInit | undefined>;
    domain: string;
    parameterType?: 'path' | 'queryString';
    mode?: 'development' | 'production';
}
export declare const useQueryOptions: () => QueryOptions;
export declare const QueryOptionsProvider: import("react").Provider<QueryOptions>;
export {};
