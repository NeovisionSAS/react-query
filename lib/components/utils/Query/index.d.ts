import { ExtendedRequestOptions } from "../../../utils/api";
import React from "react";
export declare type DataHandler<T> = (data: T) => any;
interface QueryParams<T = any> {
    query: string;
    delay?: number;
    onRead?: DataHandler<T>;
    requestOptions?: ExtendedRequestOptions;
    useConfig?: boolean;
}
interface QueryReturn<T> {
    data: T;
    loading: boolean;
    error?: string;
    manualUpdate: DataHandler<T>;
    forceRefresh: () => any;
}
interface QueryProps<T = any> extends QueryParams<T> {
    children: (qReturn: QueryReturn<T>) => JSX.Element;
}
export declare const useQuery: <T = any>({ query, delay, onRead, requestOptions, useConfig }: QueryParams<T>) => QueryReturn<T>;
/**
 * The query component is a fetch wrapper that allows to directly add logic in the design of the react DOM architecture
 */
export declare const Query: <T = any>(p: QueryProps<T>) => React.ReactElement<QueryProps<T>>;
export {};
