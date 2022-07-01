import { formFromObject } from '../../../utils/form';
import { CRUD, Endpoints } from '../CRUD';
import React, { Fragment, PropsWithChildren } from 'react';

interface CRUDFormProps extends PropsWithChildren {
  endpoints: Endpoints;
}

export const CRUDAuto = <T = any,>({
  children,
  endpoints,
}: CRUDFormProps): React.ReactElement => {
  return (
    <CRUD<T> endPoints={endpoints}>
      {({
        read: { data, loading, error },
        handleCreate,
        handleDelete,
        handleUpdate,
      }) => {
        if (error) return <div>{error}</div>;
        if (loading) return <div>Loading...</div>;

        console.log(data);

        if (Array.isArray(data)) {
          return (
            <>
              {data.map<any>((d, i) => {
                return (
                  <Fragment key={`d-${i}`}>
                    {formFromObject({
                      onSubmit: handleCreate,
                      inputs: Object.entries<any>(d).map(([k, v], i) => {
                        const iKey = `${k}-${i}`;
                        return {
                          name: k,
                          defaultValue: v,
                          id: iKey,
                        };
                      }),
                    })}
                  </Fragment>
                );
              })}
            </>
          );
        }
        return <div>Item type not supported yet</div>;
      }}
    </CRUD>
  );
};
