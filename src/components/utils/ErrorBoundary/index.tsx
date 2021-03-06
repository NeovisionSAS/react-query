/* eslint-disable no-unsafe-finally */
import styles from './index.module.scss';
import React, { ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: CatchError;
}

type CatchError = { e?: Error; info?: ErrorInfo };

class ErrorBoundary extends React.Component<
  React.HTMLAttributes<HTMLDivElement>,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: { e: undefined, info: undefined },
  };

  componentDidCatch = (e: Error, info: ErrorInfo) => {
    console.error(e);
    this.setState({ hasError: true, error: { e, info } });
  };

  render() {
    const { children } = this.props;
    const { hasError, error } = this.state;

    if (!hasError) return <React.Fragment>{children}</React.Fragment>;

    return (
      <div className={styles.main}>
        <div>{error?.e?.message}</div>
        <hr />
        <div>{error?.info?.componentStack}</div>
      </div>
    );
  }
}

export default ErrorBoundary;
