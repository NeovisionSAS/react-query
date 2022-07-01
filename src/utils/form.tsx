import { Fragment } from 'react';
import { FormCreateType, FormOptions } from '../components/utils/CRUDAuto';
import form from '../scss/form.module.scss';

const formObjectKeys = ['pattern', 'name', 'required', 'visible', 'className'];

interface FormObject {
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
}

interface FormObjectSelect {
  options: { value: string | number; text: string | number }[];
}

export type FormType<T = object> = {
  [K in keyof T]: FormObject | FormType;
};

export const asFormTypes = <T,>(types: FormType<T>) => {
  return types;
};

interface FormObjectOptions {
  method: FormCreateType;
  updateStyle?: 'each' | 'global';
  formOptions?: FormOptions<any>;
}

export const createFormObject = <T extends object>(
  type: T,
  options: FormObjectOptions,
  data: any[] = []
) => {
  return createFormObjectRecursive(type, options, data, true);
};

const createFormObjectRecursive = <T extends object>(
  type: T,
  { method, updateStyle = 'each', formOptions = {} }: FormObjectOptions,
  data: any[] = [],
  start = false
): JSX.Element => {
  if (method == 'create') {
    return (
      <>
        {Object.entries(type).map(([attr, object]) => {
          // if (!start && formObjectKeys.includes(attr))
          //   return createFormObjectRecursive<T>(object, method, data);
          const {
            className,
            name,
            visible = true,
            pk,
            select,
            ...other
          } = object as FormObject;
          const { required } = other;
          const oName = name ?? attr;
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
        <button type="submit">Submit</button>
      </>
    );
  }

  const pkName = Object.entries(type)
    .filter(([_, value]) => value.pk)
    .map(([k, v]) => v.name ?? k)[0];

  const { insert = { search: '', type: 'after', element: () => <></> } } =
    formOptions;

  const { search, type: insertType = 'after', element } = insert;

  return (
    <>
      {data.map((line) => {
        const idValue = line[pkName];
        return (
          <Fragment key={idValue}>
            {Object.entries<any>(line).map(([key, value = ''], i) => {
              const {
                className,
                name,
                visible = true,
                pk,
                select,
                ...other
              } = (type as any)[key] as FormObject;
              const { required } = other;

              // TODO include nested objects
              // if (!start && formObjectKeys.includes(attr))
              //   return createFormObjectRecursive<T>(object, method, data);

              const oName = name ?? key;
              const fName = `${key}-${idValue}`;

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
            {method != 'read' && updateStyle == 'each' && (
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
