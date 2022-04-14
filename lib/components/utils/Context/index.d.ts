/// <reference types="react" />
interface QueryOptions {
    requestMiddleware?: () => Promise<HeadersInit | undefined>;
    domain: string;
    protocol?: 'http' | 'https';
    parameterType?: 'path' | 'queryString';
}
export declare const useQueryOptions: () => QueryOptions;
export declare const QueryOptionsProvider: import("react").Provider<QueryOptions>;
export {};
