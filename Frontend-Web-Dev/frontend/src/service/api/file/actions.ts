"use server";

import instance from "@/lib/axiosInstance";

export const downloadFile = async (url: string) => {
  const response = await instance.get(url, {
    responseType: "blob", // bắt về Blob
  });
  return response;
};
