import { Method } from "../../../utils/api";
import { Query as QueryType } from "../../../utils/util";
import React, { FormEvent } from "react";
interface CRUDProps<T = any> {
    /**
     * This function is called whenever the query changes or if the state of the parameters have changed
     *
     * @param {CRUDObject} object The CRUDObject that contains all the data and function to use
     * @returns JSX.Element
     */
    children: (object: CRUDObject<T>, forceRefresh: () => void) => JSX.Element;
    /**
     * The `enpoint` to point to.
     * It can either be a `string`, thus the component will do request on that specific link.
     * You can also specify an `object` and specify where the component should request
     * for each of the `CRUD` operations
     */
    endPoints: {
        create?: string;
        read: string;
        update?: string;
        delete?: string;
    } | string;
    /**
     * Callback function whenever the component finished creating the object
     */
    onCreated?: () => any;
    /**
     * Callback function whenever the component finished reading the object
     */
    onRead?: (data: T) => any;
    /**
     * Callback function whenever the component finished updating the object
     */
    onUpdated?: () => boolean | any;
    /**
     * Callback function whenever the component finished deleting the object
     */
    onDeleted?: () => any;
    /**
     * Add a `delay` before the request is sent.
     * Very useful to test whenever you need to show some loading.
     */
    delay?: number;
    /**
     * Weither the element you are pointing to in the backend refers to an `array`
     * of elements or siply to an `item`
     */
    type?: "array" | "item";
}
interface GeneralParams {
    pathTail?: string | number;
    method: Method;
}
interface IdentifiableParams extends GeneralParams {
    name?: string;
}
interface UpdateParams extends Partial<IdentifiableParams> {
    name?: string;
}
declare type CreateParams = Partial<IdentifiableParams>;
interface DeleteParams extends Partial<IdentifiableParams> {
    id?: number | string;
}
/**
 * This interface is what types the object received in the children function
 * to interact with the CRUD functions automatically created by react-query
 * to make it easy to GET/POST/PUT/PATCH/DELETE
 *
 * @example-1
 * ```jsx
 *   {(data: CRUDObject<string>) => {
 *      const { read, handleCreate, handleUpdate, handleDelete } = data;
 *      if (read.loading) return <div>Loading...</div>;
 *
 *      return (
 *        <>
 *          <form onSubmit={handleCreate}></form>
 *          <form onSubmit={handleUpdate}></form>
 *          <form onSubmit={handleDelete}></form>
 *        </>
 *      );
 *    }}
 * ```
 * @example-2
 * ```jsx
 * {(data: CRUDObject<string>) => {
 *   const { read, handleUpdate } = data;
 *   if (read.loading) return <div>Loading...</div>;
 *
 *   // On submit, the form will send a PUT request
 *   // { "name": "Gerald" } to the endpoint "server/endpoint/1/"
 *   // or
 *   // { "primary_key": 1, "name": "Gerald" } to the endpoint "server/endpoint/"
 *   // Depending on the parameterType of the QueryOptionsProvider ("path" or "queryString")
 *   return (
 *     <form
 *       onSubmit={(e) =>
 *         handleUpdate(e, { method: 'PUT', name: 'primary_key' })
 *       }
 *     >
 *       <input type={`number`} name={`primary_key`} value={1} />
 *       <input name="name" value={`Gerald`} />
 *     </form>
 *   );
 * }}
 * ```
 */
export interface CRUDObject<T = any> {
    handleCreate: <T>(e: FormEvent, params?: CreateParams) => Promise<any>;
    read: QueryType<T>;
    handleUpdate: <T>(e: FormEvent, params?: UpdateParams) => Promise<any>;
    handleDelete: <T>(e: FormEvent | undefined, params?: DeleteParams) => Promise<any>;
}
/**
 * This component is used to simplify `CRUD` operations.
 * You give it the `endpoint(s)` to which you want to do requests and it will handle
 * all of the tasks in the background and update the state of the variables
 * it gives you from the child function.
 *
 * Make sure to define the QueryOptions param with the `QueryOptionsProvider` component
 *
 * Go to the [examples directory](https://bitbucket.org/neovision/react-query/src/master/src/examples) to see examples
 */
declare const CRUD: <T = any>(p: CRUDProps<T>) => React.ReactElement<CRUDProps<T>>;
export default CRUD;
