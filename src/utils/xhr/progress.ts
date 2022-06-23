import { PartialBy } from '../../types/global';

export type XHRProgress = (progress: TotalProgress) => any;

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

type PartialProgress<T extends Progress = Progress> = PartialBy<
  T,
  'percentage'
>;

type ProgressWithoutTotal = {
  [k in keyof TotalProgress]?: PartialProgress<
    TotalProgress[keyof TotalProgress]
  >;
};

export const handleUploadProgress = (
  e: ProgressEvent,
  totalProgress: TotalProgress,
  xhrProgress: XHRProgress,
  center: number
) => {
  const { loaded, total } = e;
  xhrProgress(
    calculateProgress(totalProgress, { upload: { loaded, total } }, center)
  );
};

export const handleDownloadProgress = (
  e: ProgressEvent,
  totalProgress: TotalProgress,
  xhrProgress: XHRProgress,
  center: number
) => {
  const { loaded, total } = e;
  xhrProgress(
    calculateProgress(totalProgress, { download: { loaded, total } }, center)
  );
};

export const calculateProgress = (
  base: TotalProgress,
  addon: ProgressWithoutTotal,
  center?: number
) => {
  const { upload, download } = base;
  base.upload = calculateInnerProgress(base.upload, addon.upload);
  base.download = calculateInnerProgress(base.download, addon.download);
  return {
    upload,
    download,
    total: {
      get loaded() {
        return upload.loaded + download.loaded;
      },
      get total() {
        return upload.total + download.total;
      },
      get percentage() {
        return (
          (upload.percentage + download.percentage) / (1 / (center ?? 0.5))
        );
      },
    },
  };
};

export const calculateInnerProgress = (
  progress: PartialProgress,
  addon?: PartialProgress
): Progress => {
  return {
    loaded: addon?.loaded ?? progress.loaded,
    total: addon?.total ?? progress.total,
    get percentage() {
      if (this.total == 0) return 0;
      return (this.loaded / this.total) * 100;
    },
  };
};

export const totalProgressInitialiser = (): TotalProgress => ({
  upload: progressInitialiser(),
  download: progressInitialiser(),
  total: progressInitialiser(),
});

export const progressInitialiser = () => ({
  loaded: 0,
  percentage: 0,
  total: 0,
});
