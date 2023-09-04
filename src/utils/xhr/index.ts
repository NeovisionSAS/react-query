import { AbortError } from "./abort";
import { applyHeaders, parseHeaders, setRequestHeaders } from "./headers";
import {
  XHRProgress,
  handleDownloadProgress,
  handleUploadProgress,
  totalProgressInitialiser,
} from "./progress";

interface XHROptions {
  progress?: XHRProgress;
  progressCenterRatio?: number;
  responseType?: XMLHttpRequestResponseType;
}

/**
 * XHR wrapper for deap request. Meaning that we want to know the loading state of the request.
 *
 * @info fetch did not have a streaming API to know the state of the sending request
 *
 * @param url
 * @param init
 * @returns Promise
 */
export const XHRFetch = (
  url: RequestInfo | URL,
  init?: RequestInit & XHROptions
): Promise<any> => {
  const {
    method = "GET",
    signal,
    body,
    progress,
    headers,
    progressCenterRatio = 0.5,
    responseType = "text",
  } = init ?? {};

  const xhrProgress = totalProgressInitialiser();

  if (signal?.aborted) return Promise.reject(new AbortError(signal.reason));

  return new Promise((resolve, reject) => {
    const r = new XMLHttpRequest();
    r.open(method, url.toString(), true);
    r.responseType = responseType;
    setRequestHeaders(r, headers ?? {});
    r.addEventListener("load", () => {
      const headers = parseHeaders(r.getAllResponseHeaders());
      const parsedData = applyHeaders(headers, r.response);
      const { status, statusText } = r;
      if (status >= 400 && status < 600) {
        reject({ status, statusText, url, data: parsedData });
      }
      resolve(parsedData);
    });
    signal?.addEventListener("abort", () => {
      r.abort();
      reject(new AbortError());
    });
    if (progress) {
      r.upload.addEventListener("progress", (e) => {
        handleUploadProgress(e, xhrProgress, progress, progressCenterRatio);
      });
      r.addEventListener("progress", (e) => {
        handleDownloadProgress(e, xhrProgress, progress, progressCenterRatio);
      });
    }
    r.send(body as XMLHttpRequestBodyInit | Document);
  });
};
