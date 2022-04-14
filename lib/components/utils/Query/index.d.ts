import React from 'react';
interface QueryProps<T = any> {
    children: (data: T, loading: boolean, error: string | null, manualUpdate: (data: T) => void, forceRefresh: () => void) => JSX.Element;
    query: string;
    method?: 'GET' | 'POST';
    delay?: number;
    body?: any;
    onRead?: (data: T) => void;
}
/**
 * The query component is a fetch wrapper that allows to directly add logic in the design of the react DOM architecture
 */
declare const Query: <T = any>(p: QueryProps<T>) => React.ReactElement<QueryProps<T>>;
export default Query;
