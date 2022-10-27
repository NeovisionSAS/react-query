import { FunctionComponent, useEffect, useState } from 'react';
import { useRequest } from '../../../../hooks/request';

export const Cors: FunctionComponent = () => {
  const [cors, setCors] = useState<string>();

  const request = useRequest();

  useEffect(() => {
    request('cors', {
      onRejected() {
        console.log('NO WORK');

        setCors('Cors not working...');
      },
    }).then((res) => {
      setCors(res);
    });
  }, []);

  return <div>Cors : {cors}</div>;
};
