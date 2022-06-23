import { PartialBy } from '../../types/global';
export declare type XHRProgress = (progress: TotalProgress) => any;
export interface TotalProgress {
    download: Progress;
    upload: Progress;
    total: Progress;
}
interface Progress {
    readonly loaded: number;
    readonly total: number;
    readonly percentage: number;
}
declare type PartialProgress<T extends Progress = Progress> = PartialBy<T, 'percentage'>;
declare type ProgressWithoutTotal = {
    [k in keyof TotalProgress]?: PartialProgress<TotalProgress[keyof TotalProgress]>;
};
export declare const handleUploadProgress: (e: ProgressEvent, totalProgress: TotalProgress, xhrProgress: XHRProgress, center: number) => void;
export declare const handleDownloadProgress: (e: ProgressEvent, totalProgress: TotalProgress, xhrProgress: XHRProgress, center: number) => void;
export declare const calculateProgress: (base: TotalProgress, addon: ProgressWithoutTotal, center?: number) => {
    upload: Progress;
    download: Progress;
    total: {
        readonly loaded: number;
        readonly total: number;
        readonly percentage: number;
    };
};
export declare const calculateInnerProgress: (progress: PartialProgress, addon?: PartialProgress) => Progress;
export declare const totalProgressInitialiser: () => TotalProgress;
export declare const progressInitialiser: () => {
    loaded: number;
    percentage: number;
    total: number;
};
export {};
