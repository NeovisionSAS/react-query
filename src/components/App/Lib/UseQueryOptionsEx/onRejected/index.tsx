import { useRequest } from '../../../../utils/QueryOptionsProvider';
import { FunctionComponent, useEffect } from 'react';

export const OnRejected: FunctionComponent = () => {
  const request = useRequest({
    onRejected: () => {
      console.log("I'm the useRequest error !");
    },
  });

  useEffect(() => {
    request('/i/do/not/exist', {
      onRejected: () => {
        console.log("I'm the request error !");
      },
    })
      .then((d) => console.log(d))
      .catch((_) => _);
  }, []);

  return <div>Ahahaha wrong request !</div>;
};
