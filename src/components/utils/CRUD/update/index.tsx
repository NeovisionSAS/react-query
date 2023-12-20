import {
  CRUDEventHandler,
  FormRequestParams,
  PartialIdentifiableGeneralParams,
  SetType,
} from "..";
import { request, requestOptionsMerge } from "../../../../utils/api";
import { setCache } from "../../../../utils/cache";
import { isFormEvent } from "../../../../utils/form";
import { requestError, requestLog } from "../../../../utils/log";
import { FormExtractorData, formExtractor } from "../../../../utils/util";
import equal from "fast-deep-equal";

interface UpdateFormRequestParams<T = any> extends FormRequestParams<T> {
  type: SetType;
}

export interface UpdateParams extends PartialIdentifiableGeneralParams {
  name?: string;
}

export const updateRequest = <T,>({
  endpoint: {
    endpoint,
    mode,
    verbosity,
    domain,
    headers,
    idName,
    parameterType,
    dateFormat,
    ...eRest
  },
  manualUpdate,
  data,
  onCompleted: onUpdated,
  type,
  forceRefresh,
  cacheKey,
}: UpdateFormRequestParams) => {
  return (e: CRUDEventHandler<T>, params: UpdateParams = { name: idName }) => {
    const {
      method = "PUT",
      name = idName,
      onRejected,
    } = requestOptionsMerge<UpdateParams>([eRest, params]);

    let formDatas: FormExtractorData[];
    if (isFormEvent(e)) {
      e.preventDefault();
      formDatas = formExtractor(e.target, name, { dateFormat });
    } else {
      formDatas = [e] as FormExtractorData[];
    }

    let newData: any;
    if (type == "array") newData = [...(data as unknown as any[])];
    else newData = data;

    const promises: Promise<any>[] = [];
    formDatas.forEach((formData) => {
      const id = formData[name];

      const endpointId = `${endpoint}/${
        parameterType == "path" ? `${id}/` : ""
      }`;

      let hasChanged = false;
      if (type == "array") {
        const index = (newData as any[]).findIndex((val) => val[name] == id);
        if (index < 0) {
          requestError(`Element with ${name} ${id} not found.`);
          throw new Error(`Element with ${name} ${id} not found.`);
        }
        const mergedData = {
          ...newData[index],
          ...formData,
        };
        hasChanged = !equal(newData[index], mergedData);
        newData[index] = mergedData;
      } else {
        newData = { ...newData, ...formData };
        hasChanged = !equal(newData, data);
      }

      if (hasChanged) {
        requestLog(
          mode,
          verbosity,
          1,
          `[update][${method}]`,
          `${domain}/${endpointId}`,
          formData
        );
        promises.push(
          request(domain, endpointId, {
            data: formData,
            method,
            headers,
            mode,
            onRejected,
          })
        );
      }
    });
    return Promise.all(promises).then(() => {
      manualUpdate?.(newData as any);
      setCache(cacheKey, newData);
      onUpdated?.() && forceRefresh?.();
      return newData;
    });
  };
};
