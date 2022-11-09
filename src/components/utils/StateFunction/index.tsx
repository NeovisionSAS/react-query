export type JSXFunction = () => JSX.Element;

interface JSXFunctionProp {
  children: JSXFunction;
}

/**
 * Component taking a function returning a JSX Element as parameter allowing to store a state inside the
 * given function.
 * @returns JSX.Element
 */
export const StateFunction = ({ children }: JSXFunctionProp) => children();
