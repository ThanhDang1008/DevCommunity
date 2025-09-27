"use server";

import instance from "@/lib/axiosInstance";

type AxiosResponse<T> = {
  status: number;
  data: T;
};

export const increaseViewPost = async (slug: string) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/post/increase-view`,
    {
      slug: slug,
    }
  );
  return response;
};
