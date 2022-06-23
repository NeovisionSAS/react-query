import { QueryOptions, RealQueryOptions, RequestOptionsWithOptionalDomain } from '../../../utils/api';
import { DependencyList } from 'react';
export declare const useQueryOptions: () => RealQueryOptions;
export declare const useRequest: (rRest?: RequestOptionsWithOptionalDomain, dependencies?: DependencyList) => <T = any>(path: string, options?: RequestOptionsWithOptionalDomain) => Promise<T>;
export declare const QueryOptionsProvider: import("react").Provider<QueryOptions>;
