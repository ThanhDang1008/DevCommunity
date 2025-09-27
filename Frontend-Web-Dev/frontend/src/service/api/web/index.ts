import { baseURL, AxiosResponse } from "@/lib/axiosInstance";

import { InfoWeb } from "./types";
import { NextAPI } from "@/shared/utils/next.api";
import { tagNext, URL } from "@/constants/Common";
import type {
  ReadDataWebResponse,
  UpdateDataWebResponse,
  ReadDataWebNextResponse,
} from "./types";

import { getAxiosInstance } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

export const updateDataWeb = async (data: InfoWeb) => {
  const response: AxiosResponse<UpdateDataWebResponse> = await instance.patch(
    `/api/v1/web/write-data`,
    data
  );
  return response;
};

export const readDataWeb = async () => {
  const response: AxiosResponse<ReadDataWebResponse> = await instance.get(
    `/api/v1/web/read-data`
  );
  return response;
};

//----------------------------- NextAPI -----------------------------

export const readDataWebNext = async (cache: boolean) => {
  const response = await NextAPI<ReadDataWebNextResponse>(
    `${baseURL}/api/v1/web/read-data`,
    {
      method: "GET",
    },
    cache
      ? {
          cache: "force-cache",
          next: {
            tags: [tagNext.WEB],
          },
        }
      : {
          cache: "no-cache",
        }
  );
  return response;
};
