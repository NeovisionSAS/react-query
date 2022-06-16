/// <reference types="react" />
import { RequestOptions } from '../../../utils/api';
interface LoaderOptions {
    loader?: JSX.Element;
    autoload?: boolean;
}
interface QueryOptions {
    requestMiddleware?: () => Promise<HeadersInit>;
    domain: string;
    parameterType?: QueryType;
    mode?: 'development' | 'production';
    verbosity?: number;
    idName?: string;
    onRejected?: (res: Response) => any;
    loader?: LoaderOptions;
}
export declare type QueryType = 'path' | 'queryString';
export declare const useQueryOptions: () => Required<QueryOptions>;
export declare const useRequest: ({ method: rMethod, ...rRest }?: RequestOptions) => <T = any>(path: string, options?: RequestOptions) => Promise<T>;
export declare const QueryOptionsProvider: import("react").Provider<QueryOptions>;
export {};
