import React, { Fragment } from 'react';
import { PartialDeep } from 'type-fest';
import form from '../../../scss/form.module.scss';
import {
  createFormObject,
  FormType,
  KeysToFormType,
} from '../../../utils/form';
import { CRUD, CRUDObject, Endpoints } from '../CRUD';

export type FormCreateType = 'create' | 'read' | 'update';

interface CRUDFormChildren<T, U> {
  data: CRUDObject<T>;
  getCreateForm: (options?: FormCreate<U>) => JSX.Element;
  getUpdateForms: (options?: FormUpdate<U>) => FormUpdateReturn[];
  forceRefresh: () => void;
}

type FormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

interface FormBase<T> {
  options?: T;
  attributes?: FormProps;
}

export interface FormBaseOptions<T> {
  override?: PartialDeep<KeysToFormType<T>>;
  insert?: FormOptionsInsert<T>;
  className?: string;
}

interface FormCreateOptions<T> extends FormBaseOptions<T> {}

export interface FormUpdateOptions<T> extends FormBaseOptions<T> {
  deletable?: JSX.Element | boolean;
}

interface FormCreate<T> extends FormBase<FormCreateOptions<T>> {}

interface FormUpdate<T> extends FormBase<FormUpdateOptions<T>> {
  index?: number;
}

interface FormUpdateProps {
  children?: JSX.Element | JSX.Element[];
}

interface FormUpdateReturn {
  Form: (props: FormUpdateProps) => JSX.Element;
  DeleteForm: (props: FormUpdateProps) => JSX.Element;
}

export interface FormOptionsInsert<T = any> {
  before?: FormOptionsInsertOrder<T>[];
  after?: FormOptionsInsertOrder<T>[];
}

export type FormOptionsInsertOrder<T> = [keyof T, () => JSX.Element];

interface CRUDFormProps<T, U> {
  endpoints: Endpoints;
  children?: (children: CRUDFormChildren<T, U>) => JSX.Element;
  type: U;
}

export const CRUDAuto = <T, U = FormType<any>>({
  children,
  endpoints,
  type,
}: CRUDFormProps<T, U>): React.ReactElement => {
  return (
    <CRUD<T> endpoints={endpoints}>
      {(crud, forceRefresh) => {
        const {
          read: { data, loading, error },
          handleCreate,
          handleDelete,
          handleUpdate,
        } = crud;

        if (error) return <div>{error}</div>;
        if (loading) return <div>Loading...</div>;

        if (children)
          return children({
            data: crud,
            getCreateForm: ({ options: opts = {}, attributes } = {}) => {
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
                    method: 'create',
                    formOptions: options,
                  })}
                </form>
              );
            },
            getUpdateForms: ({
              options: opts = {},
              attributes,
              index,
            } = {}) => {
              const { deletable, className, override = {}, ...options } = opts;

              const mergedType = Object.merge<FormType<any>>(
                {},
                type as any,
                override as any
              );

              if (Array.isArray(data)) {
                const pkName = Object.entries<any>(mergedType)
                  .filter(([_, value]) => value.pk)
                  .map(([k, v]) => v.name ?? k)[0];

                if (index)
                  return [
                    handleUpdateEach(
                      data,
                      pkName,
                      opts,
                      'update',
                      mergedType,
                      handleUpdate,
                      handleDelete,
                      attributes
                    ),
                  ];

                return data.map((d) =>
                  handleUpdateEach(
                    d,
                    pkName,
                    opts,
                    'update',
                    mergedType,
                    handleUpdate,
                    handleDelete,
                    attributes
                  )
                );
              }
              console.log('Item type not supported yet');
              return [];
            },
            forceRefresh,
          });

        if (Array.isArray(data)) {
          return (
            <>
              {data.map<any>((d, i) => {
                return <Fragment key={`d-${i}`}></Fragment>;
              })}
            </>
          );
        }
        console.log('Item type not supported yet');
        return <div>Item type not supported yet</div>;
      }}
    </CRUD>
  );
};

const handleUpdateEach = <T,>(
  d: any,
  pkName: string,
  {
    className,
    deletable = <button type="submit">Delete</button>,
    ...options
  }: FormUpdateOptions<T>,
  type: FormCreateType,
  formType: FormType<any>,
  handleUpdate: any,
  handleDelete: any,
  attributes?: FormProps
): FormUpdateReturn => {
  const value = d[pkName];
  return {
    Form: ({ children }) => {
      return (
        <Fragment key={`${pkName}-del-${value}`}>
          <div className={className}>
            <form
              {...attributes}
              className={`${form.form} ${attributes?.className}`}
              onSubmit={(e) => {
                attributes?.onSubmit?.(e);
                handleUpdate(e);
              }}
            >
              {createFormObject(
                formType,
                {
                  method: type,
                  formOptions: options as any,
                },
                [d]
              )}
              {children}
            </form>
          </div>
        </Fragment>
      );
    },
    DeleteForm: ({ children }) => {
      return (
        <form
          {...attributes}
          className={`${form.silent} ${attributes?.className}`}
          onSubmit={(e) => {
            attributes?.onSubmit?.(e);
            handleDelete(e, { name: pkName });
          }}
        >
          <input
            id={pkName}
            name={pkName}
            defaultValue={value}
            style={{ display: 'none' }}
          />
          {children ||
            ((typeof deletable != 'boolean' || deletable) && deletable)}
        </form>
      );
    },
  };
};
