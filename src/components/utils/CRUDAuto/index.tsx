import React, { Fragment, FunctionComponent, PropsWithChildren } from 'react';
import { PartialDeep } from 'type-fest';
import form from '../../../scss/form.module.scss';
import {
  createFormObject,
  FormType,
  KeysToFormType,
} from '../../../utils/form';
import { CRUD, CRUDObject, Endpoints } from '../CRUD';

export type FormCreateType = 'create' | 'read' | 'update';

interface CRUDChildren<T, U> {
  data: CRUDObject<T>;
  forms: CRUDAutoForms<T, U>;
  forceRefresh: () => void;
}

interface CRUDAutoForms<T, U> {
  CreateForm: FunctionComponent<FormCreate<U>>;
  EntriesForm: (props: EntriesProps<T, U>) => JSX.Element;
}

interface EntriesProps<T, U> extends FormBase<FormUpdateOptions<U>> {
  children?: (children: CRUDAutoFormsEntries<T, U>) => JSX.Element;
}

interface CRUDAutoFormsEntries<T, U> {
  UpdateForm: (options?: PropsWithChildren) => JSX.Element;
  DeleteForm: (options?: PropsWithChildren) => JSX.Element;
  data: T extends Array<infer J> ? J : never;
  index: number;
}

type FormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

interface FormBase<T> {
  options?: T;
  attributes?: FormProps;
}

interface FormBaseProps<T> extends FormBase<T> {
  children?: JSX.Element;
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

interface FormCreate<T> extends FormBaseProps<FormCreateOptions<T>> {}

interface FormUpdate<T> extends FormBaseProps<FormUpdateOptions<T>> {
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

interface CRUDAutoProps<T, U> {
  endpoints: Endpoints;
  children?: (children: CRUDChildren<T, U>) => JSX.Element;
  type: U;
}

export const CRUDAuto = <T, U = FormType<any>>({
  children,
  endpoints,
  type,
}: CRUDAutoProps<T, U>): React.ReactElement => {
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

        const CreateForm = ({
          options: opts = {},
          attributes,
          children,
        }: FormCreate<any> = {}) => {
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
              {children}
            </form>
          );
        };

        if (children)
          return children({
            data: crud,
            forms: {
              CreateForm,
              EntriesForm({ children, options: opts = {}, attributes }) {
                const {
                  deletable = <button type="submit">Delete</button>,
                  className,
                  override = {},
                  ...options
                } = opts;

                const mergedType = Object.merge<FormType<any>>(
                  {},
                  type as any,
                  override as any
                );

                if (Array.isArray(data)) {
                  const pkName = Object.entries<any>(mergedType)
                    .filter(([_, value]) => value.pk)
                    .map(([k, v]) => v.name ?? k)[0];

                  return (
                    <>
                      {data.map((d, index) => {
                        const value = d[pkName];

                        const UpdateForm = ({ children }: any = {}) => {
                          return (
                            <div className={className}>
                              <form
                                {...attributes}
                                className={`${form.form} ${attributes?.className}`}
                                onSubmit={(e) => {
                                  attributes?.onSubmit?.(e);
                                  handleUpdate(e);
                                }}
                              >
                                <>
                                  {createFormObject(
                                    mergedType,
                                    {
                                      method: 'update',
                                      formOptions: options as any,
                                    },
                                    [d]
                                  )}
                                  {children}
                                </>
                              </form>
                            </div>
                          );
                        };

                        const DeleteForm = ({ children }: any) => {
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
                              <>
                                {' '}
                                {children ||
                                  ((typeof deletable != 'boolean' ||
                                    deletable) &&
                                    deletable)}
                              </>
                            </form>
                          );
                        };

                        return (
                          <Fragment key={`auto-${pkName}-${index}`}>
                            {children?.({
                              UpdateForm,
                              DeleteForm,
                              data: d,
                              index,
                            })}
                          </Fragment>
                        );
                      })}
                    </>
                  );
                }
                console.log('Item type not supported yet');
                return <></>;
              },
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
