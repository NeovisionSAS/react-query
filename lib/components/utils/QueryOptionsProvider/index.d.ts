/// <reference types="react" />
import { QueryOptions, RealQueryOptions, RequestOptionsWithOptionalDomain } from '../../../utils/api';
export declare const useQueryOptions: () => RealQueryOptions;
export declare const useRequest: (rRest?: RequestOptionsWithOptionalDomain) => <T = any>(path: string, options?: RequestOptionsWithOptionalDomain) => Promise<T>;
export declare const QueryOptionsProvider: import("react").Provider<QueryOptions>;
