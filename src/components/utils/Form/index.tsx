import form from '../../../scss/form.module.scss';
import {
  createFormObjectRecursive,
  extractInsert,
  FormObject,
  FormObjectOptions,
} from '../../../utils/form';
import { requestWarn } from '../../../utils/log';
import { FunctionComponent, useEffect, useState } from 'react';

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
  const lineTypeKey = dataLine?.[typeKey];

  const [value, _setValue] = useState(lineTypeKey ?? '');

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

  const { method, formOptions = {} } = formObjectOptions;

  const { insert } = formOptions;
  const { before = [], after = [] } = insert ?? {};
  const { required } = other;

  const oName = name ?? typeKey ?? fName;

  const setValue = (v: any) => {
    _setValue(v);
    onValueChanged?.(v);
  };

  useEffect(() => {
    setValue(lineTypeKey ?? '');
  }, [dataLine, typeKey]);

  if (render && method != 'read')
    return (
      <>
        {render({
          ...formObject,
          oName,
          fName,
          value,
          setValue,
          ...formObjectOptions,
        })}
      </>
    );

  if (
    (type == 'create' && sub) ||
    (type == 'update' && !keys.includes(typeKey))
  ) {
    if (type == 'update' && !sub) {
      requestWarn(
        'development',
        0,
        0,
        `type key "${typeKey}" doesn't exist on received data`,
        dataLine
      );
      return <></>;
    }

    return (
      <div
        className={`${className}`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div className={`${form.section}`}>
          <label>{oName}</label>
        </div>
        <div {...other} className={`${form.sectionDeep}`}>
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

  if (type == 'create') {
    if (pk) return <></>;

    return (
      <>
        {extractInsert(before, fName)}
        <div className={`${form.section} ${className}`}>
          <label htmlFor={fName}>
            {oName?.capitalize()} {required && '*'}
          </label>
          {select ? (
            <select id={fName} name={fName}>
              {select.options.map((option, i) => {
                return (
                  <option key={i} value={option.value ?? option.text}>
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
      </>
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
      />
    );

  return (
    <>
      {extractInsert(before, typeKey)}
      <div className={`${form.section} ${className}`}>
        <label htmlFor={fName}>
          {oName.capitalize()} {required && '*'}
        </label>
        <>
          {method == 'read' ? (
            <div>{value}</div>
          ) : select ? (
            <select id={fName} name={fName} defaultValue={value}>
              {select.options.map((option, i) => {
                return (
                  <option key={i} value={option.value ?? option.text}>
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
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </>
      </div>
      {extractInsert(after, typeKey)}
    </>
  );
};
