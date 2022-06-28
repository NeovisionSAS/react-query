import {
  QueryOptionsConsumer,
  QueryOptionsProvider,
  useQueryOptions,
} from '../../../../utils/QueryOptionsProvider';
import { FunctionComponent } from 'react';

export const Provider: FunctionComponent = () => {
  const [options] = useQueryOptions();

  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(options).map((entry, i) => {
          return (
            <tr key={`provider-${i}`}>
              <td>{entry[0]}</td>
              <td>{`${entry[1]}`}</td>
            </tr>
          );
        })}
      </tbody>
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
      }}
    >
      <QueryOptionsConsumer>
        {([options]) => {
          return (
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(options).map((entry, i) => {
                  return (
                    <tr key={`providerOverride-${i}`}>
                      <td>{entry[0]}</td>
                      <td>{`${entry[1]}`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        }}
      </QueryOptionsConsumer>
    </QueryOptionsProvider>
  );
};
