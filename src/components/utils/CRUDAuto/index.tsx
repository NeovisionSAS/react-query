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
    options?: FormOptions<DeepPartial<KeysToFormType<U>>>
  ) => ReactElement;
}

export interface FormOptions<T> {
  override?: T;
  insert?: FormOptionsInsert<T>;
  deletable?: JSX.Element | boolean;
  className?: string;
}

interface FormOptionsInsert<T> {
  type?: 'before' | 'after';
  search: keyof T;
  element: () => JSX.Element;
}

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
    <CRUD<T> endPoints={endPoints}>
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
                ...options
              } = {}
            ) => {
              if (t == 'create')
                return (
                  <form
                    className={`${form.form} ${className}`}
                    onSubmit={handleCreate}
                  >
                    {createFormObject(type, {
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
                        type,
                        {
                          method: t,
                          formOptions: options,
                        },
                        data
                      )}
                    </div>
                  );
                if (t == 'update') {
                  const pkName = Object.entries<any>(type as object)
                    .filter(([_, value]) => value.pk)
                    .map(([k, v]) => v.name ?? k)[0];
                  return updateStyle == 'each' ? (
                    <>
                      {data.map((d, i) => {
                        const value = d[pkName];
                        return (
                          <Fragment key={i}>
                            <div className={className}>
                              <form
                                className={form.form}
                                onSubmit={(e) => handleUpdate(e)}
                              >
                                {createFormObject(
                                  type,
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
                                  className={form.silent}
                                  onSubmit={(e) =>
                                    handleDelete(e, { name: pkName })
                                  }
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
                      className={`${form.form} ${className}`}
                      onSubmit={(e) => handleUpdate(e)}
                    >
                      {createFormObject(
                        type,
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
