import React, { FormEvent } from 'react';
import { Method } from '../../../utils/api';
import { Query as QueryType } from '../../../utils/util';
interface CRUDProps<T = any> {
    children: (object: CRUDObject<T>, forceRefresh: () => void) => JSX.Element;
    endPoints: {
        create?: string;
        read: string;
        update?: string;
        delete?: string;
    } | string;
    onCreated?: () => any;
    onRead?: (data: T) => any;
    onUpdated?: () => boolean | any;
    onDeleted?: () => any;
    delay?: number;
    type?: 'array' | 'item';
}
interface GeneralParams {
    pathTail?: string | number;
    method?: Method;
}
interface UpdateParams extends GeneralParams {
    name?: string;
}
declare type CreateParams = GeneralParams;
interface DeleteParams extends GeneralParams {
    index: number;
}
export interface CRUDObject<T = any> {
    handleCreate: <T>(e: FormEvent, params?: CreateParams) => Promise<any>;
    read: QueryType<T>;
    handleUpdate: <T>(e: FormEvent, params?: UpdateParams) => Promise<any>;
    handleDelete: <T>(e: FormEvent | undefined, params: DeleteParams) => Promise<any>;
}
declare const CRUD: <T = any>(p: CRUDProps<T>) => React.ReactElement<CRUDProps<T>>;
export default CRUD;
