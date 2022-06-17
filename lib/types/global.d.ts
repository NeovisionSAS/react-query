export declare type Mode = 'development' | 'production';
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export declare type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
