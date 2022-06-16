import {
  QueryOptionsProvider,
  useQueryOptions,
} from '../../../../utils/QueryOptionsProvider';
import { FunctionComponent } from 'react';

export const Provider: FunctionComponent = () => {
  const options = useQueryOptions();

  return (
    <table>
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
      {Object.entries(options).map((entry, i) => {
        return (
          <tr key={`provider-${i}`}>
            <td>{entry[0]}</td>
            <td>{`${entry[1]}`}</td>
          </tr>
        );
      })}
    </table>
  );
};

export const ProviderOverride: FunctionComponent = () => {
  return (
    <QueryOptionsProvider
      value={{
        domain: 'My backend',
        parameterType: 'path',
        mode: 'development',
        verbosity: 0,
      }}
    >
      {(() => {
        const options = useQueryOptions();

        return (
          <table>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
            {Object.entries(options).map((entry) => {
              return (
                <tr>
                  <td>{entry[0]}</td>
                  <td>{`${entry[1]}`}</td>
                </tr>
              );
            })}
          </table>
        );
      })()}
    </QueryOptionsProvider>
  );
};
