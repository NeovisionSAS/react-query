import { Fragment } from 'react';
import { DeepPartial } from 'typeorm';
import {
  FormCreateType,
  FormOptions,
  FormOptionsInsertOrder,
} from '../components/utils/CRUDAuto';
import form from '../scss/form.module.scss';

interface FormObject<T> {
  pk?: boolean;
  pattern?: string;
  name?: string;
  required?: boolean;
  visible?: boolean;
  type?:
    | 'number'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'email'
    | 'file'
    | 'password'
    | 'radio'
    | 'submit'
    | 'tel'
    | 'text';
  className?: string;
  select?: FormObjectSelect;
  render?: (o: FormRender) => JSX.Element;
  sub?: T;
}

type FormRender<T = any> = DeepPartial<FormObject<T>> &
  FormObjectOptions & {
    oName: string;
    fName: string;
    value?: any;
  };

interface FormObjectSelect {
  options: { value: string | number; text?: string | number }[];
}

export type FormType<T, K extends keyof T = keyof T, Q extends T[K] = T[K]> = {
  [U in K]: FormObject<FormType<T[U]>>;
};

type ExtactFormType<T> = T extends FormType<infer X> ? X : never;

export type KeysToFormType<
  T,
  K = ExtactFormType<T>,
  L extends keyof K = keyof K
> = {
  [P in L]: K[P] extends object
    ? FormObject<KeysToFormType<K[P]>>
    : FormObject<K[P]>;
};

export const asFormTypes = <T,>(types: FormType<T>) => types;

interface FormObjectOptions {
  method: FormCreateType;
  updateStyle?: 'each' | 'global';
  formOptions?: FormOptions<any>;
  noSubmit?: boolean;
}

export const createFormObject = <T,>(
  type: T,
  options: FormObjectOptions,
  data: any[] = []
) => {
  return createFormObjectRecursive(type, options, data);
};

const createFormObjectRecursive = <T,>(
  type: T,
  options: FormObjectOptions,
  data: any[] = [],
  idName?: string
): JSX.Element => {
  const {
    method,
    updateStyle = 'each',
    formOptions = {},
    noSubmit = false,
  } = options;

  const { insert } = formOptions;
  const { before = [], after = [] } = insert ?? {};

  if (method == 'create') {
    return (
      <>
        {Object.entries(type as object).map(([fName, object]) => {
          const {
            className,
            name,
            visible = true,
            pk,
            select,
            sub,
            render,
            ...other
          } = object as FormObject<any>;
          const { required } = other;
          const oName = name ?? fName;

          if (render)
            return (
              <Fragment key={fName}>
                {render({ ...object, oName, fName, ...options })}
              </Fragment>
            );

          if (sub) {
            return (
              <div
                key={fName}
                className={`${className}`}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div className={`${form.section}`}>
                  <label>{oName}</label>
                </div>
                <div {...other} className={`${form.sectionDeep}`}>
                  {createFormObjectRecursive(
                    sub,
                    { ...options, noSubmit: true },
                    data
                  )}
                </div>
              </div>
            );
          }

          if (pk) return <Fragment key={fName}></Fragment>;

          return (
            <Fragment key={fName}>
              {extractInsert(before, fName)}
              <div className={`${form.section} ${className}`}>
                <label htmlFor={fName}>
                  {oName?.capitalize()} {required && '*'}
                </label>
                {select ? (
                  <select id={fName} name={fName}>
                    {select.options.map((option, i) => {
                      return (
                        <option
                          key={`${fName}-${i}`}
                          value={option.value ?? option.text}
                        >
                          {option.text ?? option.value}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input {...other} id={fName} name={fName} />
                )}
              </div>
              {extractInsert(after, fName)}
            </Fragment>
          );
        })}
        {!noSubmit && <button type="submit">Submit</button>}
      </>
    );
  }

  const pkName = Object.entries(type as object)
    .filter(([_, value]) => value.pk)
    .map(([k, v]) => v.name ?? k)[0];

  return (
    <>
      {data.map((line) => {
        const idValue = line[idName ?? pkName];

        const lineKeys = Object.keys(line);
        return (
          <Fragment key={idValue}>
            {Object.entries(type as any).map(([key, v], i) => {
              const {
                className,
                name,
                visible = true,
                pk,
                select,
                sub,
                render,
                ...other
              } = v as FormObject<any>;

              const { required } = other;

              const oName = name ?? key;
              const fName = `${key}-${idValue}`;

              const value = line[key];

              if (render)
                return (
                  <Fragment key={`${fName}-${i}`}>
                    {render({
                      ...(v as FormObject<any>),
                      oName,
                      fName,
                      value,
                      ...options,
                    })}
                  </Fragment>
                );

              if (!lineKeys.includes(key)) {
                return (
                  <Fragment key={`${fName}-${i}`}>
                    <div className={`${form.section}`}>
                      <label>{oName}</label>
                    </div>
                    <div
                      {...other}
                      className={`${form.sectionDeep} ${className}`}
                    >
                      {createFormObjectRecursive(
                        sub,
                        { ...options, noSubmit: true },
                        data,
                        pkName
                      )}
                    </div>
                  </Fragment>
                );
              }

              if (!visible)
                return (
                  <input
                    {...other}
                    key={`${fName}-${i}`}
                    className={className}
                    style={{ display: 'none' }}
                    id={`${fName}`}
                    name={`${fName}`}
                    defaultValue={value}
                  />
                );

              return (
                <Fragment key={`${fName}-${i}`}>
                  {extractInsert(before, key)}
                  <div className={`${form.section} ${className}`}>
                    <label htmlFor={fName}>
                      {oName.capitalize()} {required && '*'}
                    </label>
                    {method == 'read' ? (
                      <div>{value}</div>
                    ) : select ? (
                      <select id={fName} name={fName} defaultValue={value}>
                        {select.options.map((option, i) => {
                          return (
                            <option
                              key={`${fName}-${i}`}
                              value={option.value ?? option.text}
                            >
                              {option.text ?? option.value}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <input
                        {...other}
                        id={`${fName}`}
                        name={`${fName}`}
                        defaultValue={value}
                      />
                    )}
                  </div>
                  {extractInsert(after, key)}
                </Fragment>
              );
            })}
            {method != 'read' && updateStyle == 'each' && !noSubmit && (
              <button key={`btn-${idValue}`} type="submit">
                Submit
              </button>
            )}
          </Fragment>
        );
      })}
    </>
  );
};

const extractInsert = (insert: FormOptionsInsertOrder<any>[], s: string) => {
  return insert.filter(([search]) => search == s).map(([, e]) => e?.());
};
