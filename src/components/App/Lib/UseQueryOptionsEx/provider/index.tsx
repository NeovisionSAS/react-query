import { FunctionComponent } from 'react';
import {
  QueryOptionsConsumer,
  QueryOptionsProvider,
  useQueryOptions,
} from '../../../../utils/QueryOptionsProvider';

export const Provider: FunctionComponent = () => {
  const [options, setQueryOptions] = useQueryOptions();

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
            <tr key={i}>
              <td>{entry[0]}</td>
              <td>
                <input
                  onChange={(e) => {
                    const newOptions = Object.merge(options, {
                      [entry[0]]: e.target.value,
                    } as any);
                    setQueryOptions(newOptions);
                    localStorage.setItem(
                      'queryOptions',
                      JSON.stringify(newOptions)
                    );
                  }}
                  defaultValue={`${entry[1]}`}
                />
              </td>
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
                    <tr key={i}>
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
