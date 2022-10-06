import { Fragment } from 'react';
import { FormCreateType, FormOptions } from '../components/utils/CRUDAuto';
import form from '../scss/form.module.scss';

const formObjectKeys = ['pattern', 'name', 'required', 'visible', 'className'];

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
  sub?: T;
}

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

const x = asFormTypes({
  a: {
    name: 'Hello',
  },
});

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
  if (method == 'create') {
    return (
      <>
        {Object.entries(type as object).map(([attr, object]) => {
          const {
            className,
            name,
            visible = true,
            pk,
            select,
            sub,
            ...other
          } = object as FormObject<any>;
          const { required } = other;
          const oName = name ?? attr;

          if (sub) {
            return (
              <div
                key={attr}
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

          if (pk) return <Fragment key={attr}></Fragment>;
          return (
            <div key={attr} className={`${form.section} ${className}`}>
              <label htmlFor={attr}>
                {oName?.capitalize()} {required && '*'}
              </label>
              {select ? (
                <select id={attr} name={attr}>
                  {select.options.map((option, i) => {
                    return (
                      <option
                        key={`${attr}-${i}`}
                        value={option.value ?? option.text}
                      >
                        {option.text ?? option.value}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input {...other} id={attr} name={attr} />
              )}
            </div>
          );
        })}
        {!noSubmit && <button type="submit">Submit</button>}
      </>
    );
  }

  const pkName = Object.entries(type as object)
    .filter(([_, value]) => value.pk)
    .map(([k, v]) => v.name ?? k)[0];

  const { insert = { search: '', type: 'after', element: () => <></> } } =
    formOptions;

  const { search, type: insertType = 'after', element } = insert;

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
                ...other
              } = v as FormObject<any>;

              const { required } = other;

              const oName = name ?? key;
              const fName = `${key}-${idValue}`;

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

              const value = line[key];

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
                  {insertType == 'before' && search == key && element()}
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
                  {insertType == 'after' && search == key && element()}
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
