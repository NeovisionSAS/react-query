import { ErrorBoundary } from '../../../utils';
import { Fragment, FunctionComponent, useState } from 'react';

export const ErrorEx: FunctionComponent = () => {
  const [showError, setShowError] = useState(true);

  return (
    <>
      <div>
        <button onClick={() => setShowError(!showError)}>
          {showError ? 'Remove error' : 'Show error'}
        </button>
      </div>
      <ErrorBoundary detail={false}>
        {showError && <ErrorComponent />}
      </ErrorBoundary>
    </>
  );
};

const ErrorComponent = () => {
  return (
    <Fragment>
      {(() => {
        throw Error('Random error');
      })()}
    </Fragment>
  );
};
