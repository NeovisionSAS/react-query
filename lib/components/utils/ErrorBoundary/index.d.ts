import React, { ErrorInfo } from 'react';
interface ErrorBoundaryState {
    hasError: boolean;
    error: CatchError;
}
declare type CatchError = {
    e?: Error;
    info?: ErrorInfo;
};
declare class ErrorBoundary extends React.Component<React.HTMLAttributes<HTMLDivElement>, ErrorBoundaryState> {
    state: ErrorBoundaryState;
    componentDidCatch: (e: Error, info: ErrorInfo) => void;
    render(): JSX.Element;
}
export default ErrorBoundary;
