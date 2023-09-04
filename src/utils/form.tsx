/**
 * This file is used to try and generalize the concept of forms along with the querying features of react-query
 */
import {
  FormBaseOptions,
  FormCreateType,
  FormOptionsInsertOrder,
} from "../components/utils/CRUDAuto";
import { Form } from "../components/utils/Form";
import { Dispatch, FormEvent, Fragment, SetStateAction } from "react";
import { PartialDeep } from "type-fest";

export interface FormObject<T> {
  pk?: boolean;
  pattern?: string;
  name?: string;
  required?: boolean;
  visible?: boolean;
  type?:
    | "number"
    | "checkbox"
    | "color"
    | "date"
    | "email"
    | "file"
    | "password"
    | "radio"
    | "submit"
    | "tel"
    | "text";
  className?: string;
  min?: number;
  max?: number;
  select?: FormObjectSelect;
  render?: (o: FormRender) => JSX.Element;
  onValueChanged?: (v: any) => any;
  sub?: T;
}

export type FormRender<T = any> = PartialDeep<FormObject<T>> &
  FormObjectOptions & {
    oName: string;
    fName: string;
    value: any;
    setValue: Dispatch<SetStateAction<string>>;
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

export interface FormObjectOptions {
  method: FormCreateType;
  formOptions?: FormBaseOptions<any>;
  noSubmit?: boolean;
}

/**
 * Function used to create a Form element from form options
 *
 * @param type
 * @param options
 * @param data
 * @returns JSX.Element
 */
export const createFormObject = <T,>(
  type: T,
  options: FormObjectOptions,
  data: any[] = []
) => {
  return createFormObjectRecursive(type, options, data);
};

export const createFormObjectRecursive = <T,>(
  type: T,
  options: FormObjectOptions,
  data: any[] = [],
  idName?: string
): JSX.Element => {
  const { method, noSubmit = false, formOptions = {} } = options;
  const { updatable = <button type="submit">Submit</button> } = formOptions;

  const pkName =
    idName ??
    Object.entries(type as object)
      .filter(([_, value]) => value.pk)
      .map(([k, v]) => v.name ?? k)[0];

  if (method == "create") {
    return (
      <>
        {Object.entries(type as object).map(([fName, object], i) => {
          return (
            <Form
              key={i}
              formObject={object as any}
              formObjectOptions={options}
              pkName={pkName}
              type={method}
              typeKey={fName}
            />
          );
        })}
        {!noSubmit && (typeof updatable != "boolean" || updatable) && updatable}
      </>
    );
  }

  return (
    <>
      {data.map((line, i) => {
        const idValue = line[pkName];

        const lineKeys = Object.keys(line);
        return (
          <Fragment key={i}>
            <>
              {Object.entries(type as any).map(([key, v], i) => {
                return (
                  <Form
                    type="update"
                    key={i}
                    formObject={v as any}
                    formObjectOptions={options}
                    typeKey={key}
                    keys={lineKeys}
                    pkName={pkName}
                    idValue={idValue}
                    dataLine={line}
                    data={data}
                  />
                );
              })}
            </>
            <>
              {method != "read" &&
                !noSubmit &&
                (typeof updatable != "boolean" || updatable) &&
                updatable}
            </>
          </Fragment>
        );
      })}
    </>
  );
};

export const extractInsert = (
  insert: FormOptionsInsertOrder<any>[],
  s: string
) => {
  return insert
    .filter(([search]) => search == s)
    .map(([, e], i) => <Fragment key={i}>{e?.()}</Fragment>);
};

export const isFormEvent = (e: object): e is FormEvent => {
  if ("target" in e) return true;
  return false;
};
