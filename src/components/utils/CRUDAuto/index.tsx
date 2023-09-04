import { QueryParams } from "../../../hooks/query";
import form from "../../../scss/form.module.scss";
import {
  createFormObject,
  FormType,
  KeysToFormType,
} from "../../../utils/form";
import { CRUD, CRUDObject, Endpoints } from "../CRUD";
import { getDeleteForm } from "../Form/Delete";
import { getUpdateForm } from "../Form/Update";
import { StateFunction } from "../StateFunction";
import hash from "object-hash";
import React, { Fragment, FunctionComponent, useMemo } from "react";
import { PartialDeep } from "type-fest";

export type FormCreateType = "create" | "read" | "update";

interface CRUDChildren<T, U> {
  data: CRUDObject<T>;
  forms: CRUDAutoForms<T, U>;
  forceRefresh: () => void;
}

interface CRUDAutoForms<T, U> {
  CreateForm: FunctionComponent<FormCreate<U>>;
  EntriesForm: (props: EntriesProps<T, U>) => JSX.Element;
}

export interface EntriesProps<T, U> extends FormBase<FormUpdateOptions<U>> {
  children?: (children: CRUDAutoFormsEntries<T, U>) => JSX.Element;
}

interface CRUDAutoFormsEntries<T, U> {
  UpdateForm: ReturnType<typeof getUpdateForm>;
  DeleteForm: ReturnType<typeof getDeleteForm>;
  data: T extends Array<infer J> ? J : T;
  index: number;
}

type FormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

export interface FormBase<T> {
  options?: T;
  attributes?: FormProps;
}

export interface FormBaseProps<T> extends FormBase<T> {
  children?: JSX.Element;
}

export interface FormBaseOptions<T> {
  override?: PartialDeep<KeysToFormType<T>>;
  insert?: FormOptionsInsert<T>;
  className?: string;
  updatable?: JSX.Element | boolean;
}

interface FormCreateOptions<T> extends FormBaseOptions<T> {}

export interface FormUpdateOptions<T> extends FormBaseOptions<T> {
  deletable?: JSX.Element | boolean;
}

interface FormCreate<T> extends FormBaseProps<FormCreateOptions<T>> {}

/**
 * Where to insert an element in the form element
 */
export interface FormOptionsInsert<T = any> {
  before?: FormOptionsInsertOrder<T>[];
  after?: FormOptionsInsertOrder<T>[];
}

export type FormOptionsInsertOrder<T> = [keyof T, () => JSX.Element];

interface CRUDAutoProps<T, U> extends QueryParams<T> {
  endpoints: Endpoints;
  children: (children: CRUDChildren<T, U>) => JSX.Element;
  type: U;
}

/**
 * Go to the [examples directory](https://github.com/NeovisionSAS/react-query/tree/main/src/examples) to see examples
 */
export const CRUDAuto = <T extends object, U = FormType<any>>({
  children,
  endpoints,
  type,
  ...options
}: CRUDAutoProps<T, U>): React.ReactElement => {
  return (
    <CRUD<T> endpoints={endpoints} {...options}>
      {(crud, forceRefresh) => {
        const {
          read: { data, loading, error },
          handleCreate,
          handleUpdate,
          handleDelete,
        } = crud;

        const forms: CRUDAutoForms<any, any> | undefined = useMemo(() => {
          if (loading) return undefined;
          return {
            CreateForm({ options: opts = {}, attributes, children } = {}) {
              const { className, override = {}, ...options } = opts;

              const mergedType = Object.merge<FormType<any>>(
                {},
                type as any,
                override as any
              );

              return (
                <form
                  {...attributes}
                  className={`${form.form} ${className} ${attributes?.className}`}
                  onSubmit={(e) => {
                    attributes?.onSubmit?.(e);
                    handleCreate(e);
                  }}
                >
                  {createFormObject(mergedType, {
                    method: "create",
                    formOptions: options,
                  })}
                  {children}
                </form>
              );
            },
            EntriesForm({ children, ...props }) {
              const { override = {} } = props.options ?? {};

              const mergedType = Object.merge<FormType<any>>(
                {},
                type as any,
                override as any
              );

              const pkName = Object.entries<any>(mergedType)
                .filter(([_, value]) => value.pk)
                .map(([k, v]) => v.name ?? k)[0];

              const createForms = (
                data: any,
                value: any,
                index: number = 0
              ) => {
                return (
                  <Fragment key={index}>
                    {children?.({
                      UpdateForm: getUpdateForm({
                        data,
                        handleUpdate,
                        type: mergedType,
                        ...props,
                      }),
                      DeleteForm: getDeleteForm({
                        pkName,
                        handleDelete,
                        data,
                        value,
                        ...props,
                      }),
                      data,
                      index,
                    })}
                  </Fragment>
                );
              };

              if (Array.isArray(data)) {
                return (
                  <>
                    {data.map((d, i) => {
                      const value = d[pkName];

                      return createForms(d, value, i);
                    })}
                  </>
                );
              } else return createForms(data, (data as any)[pkName]);
            },
          };
        }, [hash(type ?? {}), loading, data]);

        if (error) return <div>{error}</div>;
        if (loading) return <div>Loading...</div>;

        return (
          <StateFunction>
            {() => {
              return children({
                data: crud,
                forms: forms!,
                forceRefresh,
              });
            }}
          </StateFunction>
        );
      }}
    </CRUD>
  );
};
