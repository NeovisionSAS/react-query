import { FunctionComponent, useEffect, useState } from 'react';
import form from '../../../scss/form.module.scss';
import {
  createFormObjectRecursive,
  extractInsert,
  FormObject,
  FormObjectOptions,
} from '../../../utils/form';
import { requestWarn } from '../../../utils/log';
import { useQueryOptions } from '../QueryOptionsProvider';

interface FormProps {
  formObject: FormObject<any>;
  idValue?: any;
  pkName: any;
  formObjectOptions: FormObjectOptions;
  keys?: any;
  typeKey: any;
  dataLine?: any;
  data?: any;
  type: 'update' | 'create';
  fName?: any;
}

export const Form: FunctionComponent<FormProps> = ({
  formObject,
  formObjectOptions,
  idValue,
  keys,
  pkName,
  typeKey,
  dataLine,
  data,
  fName = idValue ? `${typeKey}-${idValue}` : typeKey,
  type,
}) => {
  const [{ mode, verbosity }] = useQueryOptions();

  const {
    className,
    name,
    visible = true,
    pk,
    select,
    sub,
    render,
    onValueChanged,
    ...other
  } = formObject;

  if (type == 'update' && !sub && dataLine && !(typeKey in dataLine)) {
    requestWarn(
      mode,
      verbosity,
      0,
      `Key "${typeKey}" doesn't exist on received data`
    );
    return <></>;
  }

  const state = dataLine?.[typeKey] ?? '';

  const [value, _setValue] = useState(state);

  const { method, formOptions = {} } = formObjectOptions;

  const { insert } = formOptions;
  const { before = [], after = [] } = insert ?? {};
  const { required } = other;

  const oName = name ?? typeKey ?? fName;

  const setValue = (v: any) => {
    _setValue(v);
    onValueChanged?.(v);
  };

  const lineOptions = {
    ...formObject,
    oName,
    fName,
    value,
    setValue,
    data: dataLine,
    ...formObjectOptions,
  };

  useEffect(() => {
    setValue(state);
  }, [dataLine, typeKey]);

  if (render) return <>{render(lineOptions)}</>;

  if (
    sub &&
    (type == 'create' || (type == 'update' && keys && !keys.includes(typeKey)))
  ) {
    return (
      <div
        className={`${className}`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div className={`${form.section}`}>
          <label>{oName}</label>
        </div>
        <div className={`${form.sectionDeep} ${className}`}>
          {createFormObjectRecursive(
            sub,
            { ...formObjectOptions, noSubmit: true },
            data,
            pkName
          )}
        </div>
      </div>
    );
  }

  if (!visible)
    return (
      <input
        {...other}
        className={className}
        style={{ display: 'none' }}
        id={`${fName}`}
        name={`${fName}`}
        defaultValue={value}
        readOnly
      />
    );

  if (type == 'create') {
    if (pk) return <></>;

    return (
      <>
        <>{extractInsert(before, fName, lineOptions)}</>
        <div className={`${form.section} ${className}`}>
          <label htmlFor={fName}>
            {oName?.capitalize()} {required && '*'}
          </label>
          {select ? (
            <select id={fName} name={fName}>
              {...select.options.map((option) => {
                return (
                  <option value={option.value ?? option.text}>
                    {option.text ?? option.value}
                  </option>
                );
              })}
            </select>
          ) : (
            <input
              {...other}
              id={fName}
              name={fName}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </div>
        <>{extractInsert(after, fName, lineOptions)}</>
      </>
    );
  }

  return (
    <>
      <>{extractInsert(before, typeKey, lineOptions)}</>
      <div className={`${form.section} ${className}`}>
        <label htmlFor={fName}>
          {oName.capitalize()} {required && '*'}
        </label>
        {method == 'read' ? (
          <div>{value}</div>
        ) : select ? (
          <select id={fName} name={fName} defaultValue={value}>
            {...select.options.map((option) => {
              return (
                <option value={option.value ?? option.text}>
                  {option.text ?? option.value}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            {...other}
            id={fName}
            name={fName}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
      </div>
      <>{extractInsert(after, typeKey, lineOptions)}</>
    </>
  );
};
