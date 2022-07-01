import { HTMLProps } from 'react';

interface FormData extends HTMLProps<HTMLFormElement> {
  inputs: InputData[];
}

interface InputData extends HTMLProps<HTMLInputElement> {}

export const formFromObject = ({ inputs, ...formProps }: FormData) => {
  return (
    <form {...formProps}>
      {inputs.map((input) => {
        return (
          <div key={`${input.name}`}>
            <label>{input.name?.capitalize()}</label>
            <input {...input} />
          </div>
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
};

export const createFormFromObject = ({ inputs, ...formProps }: FormData) => {
  return (
    <form {...formProps}>
      {inputs.map((input) => {
        return (
          <div key={`${input.name}`}>
            <label>{input.name?.capitalize()}</label>
            <input {...input} />
          </div>
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
};
