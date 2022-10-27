import { FunctionComponent, useEffect } from 'react';
import { useRequest } from '../../../../../hooks/request';

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
