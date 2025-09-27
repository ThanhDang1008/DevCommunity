import { AxiosResponse } from "@/lib/axiosInstance";

import type { GetAllRole } from "./types";

import { getAxiosInstance } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

export const getAllRole = async () => {
  const response: AxiosResponse<GetAllRole> = await instance.get(
    "/api/v1/role"
  );
  return response;
};
