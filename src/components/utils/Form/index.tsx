import { FunctionComponent, useState } from 'react';
import form from '../../../scss/form.module.scss';
import {
  createFormObjectRecursive,
  extractInsert,
  FormObject,
  FormObjectOptions,
} from '../../../utils/form';

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
  const [value, _setValue] = useState(dataLine?.[typeKey]);

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

  if (render)
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
    return (
      <div
        className={`${className}`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div className={`${form.section}`}>
          <label>{oName}</label>
        </div>
        <div {...other} className={`${form.sectionDeep} ${className}`}>
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
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
      </div>
      {extractInsert(after, typeKey)}
    </>
  );
};
