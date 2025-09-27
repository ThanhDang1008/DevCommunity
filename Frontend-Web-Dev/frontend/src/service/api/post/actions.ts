"use server";

import { NextAPI } from "@/shared/utils/next.api";
import { baseURL } from "@/lib/axiosInstance";
import { GetAllPostByViewPublic } from "./types";

export const getAllPostByViewPublicNext = async (
  page: number,
  limit: number
) => {
  const response = await NextAPI<GetAllPostByViewPublic>(
    `${baseURL}/api/v1/post/view/public?page=${page}&limit=${limit}`,
    {
      method: "POST",
    },
    {
      cache: "force-cache",
      next: {
        revalidate: 30,
      },
    }
  );
  return response;
};
