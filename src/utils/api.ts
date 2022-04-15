export type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface SetDataOptions {
  middleware?: Promise<HeadersInit | undefined>;
  method?: Method;
  body?: string;
}

export const setData = function <T = any>(
  domain: string,
  path: string,
  options: SetDataOptions = { method: 'POST' }
): Promise<T> {
  const { body, method, middleware } = options;

  const req = (headers: HeadersInit | undefined) =>
    fetch(`${domain}/${path}`, {
      method,
      headers,
      body,
    }).then((res: Response) => {
      if (res.ok) {
        try {
          return res.json();
        } catch (e) {
        } finally {
          return '';
        }
      }
      throw new Error('Something went wrong');
    });

  return middleware ? middleware.then(req) : req({});
};
