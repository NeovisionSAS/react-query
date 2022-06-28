import { AbortError } from './abort';
import { applyHeaders, parseHeaders, setRequestHeaders } from './headers';
import {
  handleDownloadProgress,
  handleUploadProgress,
  totalProgressInitialiser,
  XHRProgress,
} from './progress';

interface XHROptions {
  progress?: XHRProgress;
  progressCenterRatio?: number;
}

export const XHRFetch = (
  url: RequestInfo | URL,
  init?: RequestInit & XHROptions
): Promise<any> => {
  const {
    method = 'GET',
    signal,
    body,
    progress,
    headers,
    progressCenterRatio = 0.5,
  } = init ?? {};

  const xhrProgress = totalProgressInitialiser();

  if (signal?.aborted) return Promise.reject(new AbortError(signal.reason));

  return new Promise((resolve, reject) => {
    const r = new XMLHttpRequest();
    r.open(method, url.toString(), true);
    setRequestHeaders(r, headers ?? {});
    r.addEventListener('load', (e) => {
      const headers = parseHeaders(r.getAllResponseHeaders());
      const parsedData = applyHeaders(headers, r.response);
      resolve(parsedData);
    });
    r.addEventListener('readystatechange', () => {
      const { status, statusText } = r;
      if (status >= 400 && status < 600) reject({ status, statusText });
    });
    signal?.addEventListener('abort', () => {
      r.abort();
      reject(new AbortError());
    });
    if (progress) {
      r.upload.addEventListener('progress', (e) => {
        handleUploadProgress(e, xhrProgress, progress, progressCenterRatio);
      });
      r.addEventListener('progress', (e) => {
        handleDownloadProgress(e, xhrProgress, progress, progressCenterRatio);
      });
    }
    r.addEventListener('error', () => {
      console.log('ERRR');
    });
    r.send(body as XMLHttpRequestBodyInit | Document);
  });
};
