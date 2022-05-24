import { Mode } from "../types/global";
import { queryError, queryWarn, queryWarn as requestWarn } from "./log";

export type Method = "POST" | "PUT" | "PATCH" | "DELETE" | "GET";

export interface RequestOptions {
  headers?: () => Promise<HeadersInit>;
  method?: Method;
  body?: string;
  mode?: Mode;
  signal?: AbortSignal;
  onRejected?: (res: Response) => any;
}

export interface ExtendedRequestOptions extends RequestOptions {
  domain?: string;
}

export const request = function <T = any>(
  domain: string,
  path: string,
  options: RequestOptions = { method: "GET" }
): Promise<T> {
  const {
    body,
    method = "GET",
    headers,
    mode = "production",
    signal,
    onRejected
  } = options;

  const req = (headers: HeadersInit) => {
    return fetch(`${domain}/${path}`, {
      headers,
      method,
      body,
      signal
    })
      .then((res) => {
        if (!res.ok) {
          queryError(`${res.url} ${res.status} ${res.statusText}`);
          onRejected?.(res);
          return Promise.reject(res.statusText);
        }
        return res.text().then((t) => {
          try {
            if ((headers as any)?.["Content-Type"] == "application/json")
              return JSON.parse(t);
          } catch (e) {
            requestWarn(mode, 0, 0, `Could not parse response to json`, res);
          }
          return t;
        });
      })
      .catch((err) => {
        if (err.name == "AbortError") queryWarn(mode, 0, 0, err.message);
        throw new Error(err);
      });
  };

  return headers ? headers().then(req) : req({});
};
