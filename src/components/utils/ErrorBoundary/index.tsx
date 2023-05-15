/* eslint-disable no-unsafe-finally */
import { requestError } from '../../../utils/log';
import styles from './index.module.scss';
import React, { ErrorInfo, PropsWithChildren, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: CatchError;
  children?: ReactNode;
}

interface ErrorBoundaryProps extends PropsWithChildren {
  detail?: boolean;
}

const getDefaultState = (
  children: ErrorBoundaryState['children'] = undefined
): ErrorBoundaryState => ({
  hasError: false,
  error: { e: undefined, info: undefined },
  children,
});

type CatchError = { e?: Error; info?: ErrorInfo };

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = getDefaultState();

  constructor(props: any) {
    super(props);
    this.resetIfChanged = this.resetIfChanged.bind(this);
    this.state.children = props.children;
  }

  componentDidCatch = (e: Error, info: ErrorInfo) => {
    requestError(e);
    this.setState({ hasError: true, error: { e, info } });
  };

  resetIfChanged(children: any) {
    if (children != this.state.children)
      this.setState(getDefaultState(this.props.children));
  }

  render() {
    const { children, detail } = this.props;
    const { hasError, error } = this.state;

    this.resetIfChanged(children);

    if (!hasError) return <>{children}</>;

    return (
      <div className={styles.main}>
        <div>{error?.e?.message}</div>
        {detail && (
          <>
            <hr />
            <div>
              {error?.info?.componentStack.split('\n').map((v, k) => (
                <div key={k}>{v}</div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default ErrorBoundary;
