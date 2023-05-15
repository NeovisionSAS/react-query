/* eslint-disable no-unsafe-finally */
import { requestError } from '../../../utils/log';
import styles from './index.module.scss';
import React, { ErrorInfo, PropsWithChildren } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: CatchError;
}

interface ErrorBoundaryProps extends PropsWithChildren {
  detail?: boolean;
}

const getDefaultState = (): ErrorBoundaryState => ({
  hasError: false,
  error: { e: undefined, info: undefined },
});

type CatchError = { e?: Error; info?: ErrorInfo };

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = getDefaultState();

  componentDidCatch = (e: Error, info: ErrorInfo) => {
    requestError(e);
    this.setState({ hasError: true, error: { e, info } });
  };

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>): void {
    if (prevProps.children != this.props.children)
      this.setState(getDefaultState());
  }

  render() {
    const { children, detail } = this.props;
    const { hasError, error } = this.state;

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
