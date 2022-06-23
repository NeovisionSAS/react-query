import { XHRProgress } from './progress';
interface XHROptions {
    progress?: XHRProgress;
    progressCenterRatio?: number;
}
export declare const XHRFetch: (url: RequestInfo | URL, init?: RequestInit & XHROptions) => Promise<any>;
export {};
