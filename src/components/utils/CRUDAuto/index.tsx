import React, { Fragment, ReactElement } from 'react';
import { DeepPartial } from 'typeorm';
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
  getForm: (
    type: FormCreateType,
    options?: FormOptions<DeepPartial<KeysToFormType<U>>>,
    attributes?: React.DetailedHTMLProps<
      React.FormHTMLAttributes<HTMLFormElement>,
      HTMLFormElement
    >
  ) => ReactElement;
}

export interface FormOptions<T> {
  override?: T;
  insert?: FormOptionsInsert<T>;
  deletable?: JSX.Element | boolean;
  className?: string;
}

export interface FormOptionsInsert<T = any> {
  before?: FormOptionsInsertOrder<T>[];
  after?: FormOptionsInsertOrder<T>[];
}

export type FormOptionsInsertOrder<T> = [keyof T, () => JSX.Element];

interface CRUDFormProps<T, U> {
  endPoints: Endpoints;
  children?: (children: CRUDFormChildren<T, U>) => JSX.Element;
  type: U;
  updateStyle?: 'each' | 'global';
}

export const CRUDAuto = <T, U = FormType<any>>({
  children,
  endPoints,
  type,
  updateStyle = 'each',
}: CRUDFormProps<T, U>): React.ReactElement => {
  return (
    <CRUD<T> endpoints={endPoints}>
      {(crud) => {
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
            getForm: (
              t,
              {
                deletable = <button type="submit">Delete</button>,
                className,
                override = {},
                ...options
              } = {},
              attributes
            ) => {
              const mergedType = Object.merge<FormType<any>>(
                {},
                type as any,
                override as any
              );

              if (t == 'create')
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
                      method: t,
                      updateStyle,
                      formOptions: options,
                    })}
                  </form>
                );
              if (Array.isArray(data)) {
                if (t == 'read')
                  return (
                    <div className={`${form.form} ${className}`}>
                      {createFormObject(
                        mergedType,
                        {
                          method: t,
                          formOptions: options,
                        },
                        data
                      )}
                    </div>
                  );
                if (t == 'update') {
                  const pkName = Object.entries<any>(mergedType)
                    .filter(([_, value]) => value.pk)
                    .map(([k, v]) => v.name ?? k)[0];
                  return updateStyle == 'each' ? (
                    <>
                      {data.map((d) => {
                        const value = d[pkName];
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
                                  mergedType,
                                  {
                                    method: t,
                                    updateStyle,
                                    formOptions: options,
                                  },
                                  [d]
                                )}
                              </form>
                              {(typeof deletable != 'boolean' || deletable) && (
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
                                  {deletable}
                                </form>
                              )}
                            </div>
                          </Fragment>
                        );
                      })}
                    </>
                  ) : (
                    <form
                      {...attributes}
                      className={`${form.form} ${className} ${attributes?.className}`}
                      onSubmit={(e) => {
                        attributes?.onSubmit?.(e);
                        handleUpdate(e);
                      }}
                    >
                      {createFormObject(
                        mergedType,
                        {
                          method: t,
                          updateStyle,
                          formOptions: options,
                        },
                        data
                      )}
                      <button type="submit">Submit</button>
                    </form>
                  );
                }
              }
              console.log('Item type not supported yet');
              return <div>Item type not supported yet</div>;
            },
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
