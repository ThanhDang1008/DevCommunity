"use server";

import axios from "@/lib/axiosInstance";
import { URL, SECRET_KEY } from "@/constants/Common";

export const revalidateTag = async (tag: string) => {
  const response: any = await axios.get(
    `${URL}/api/revalidate?secret=${SECRET_KEY}&tag=${tag}`,
    {
      timeout: 5000, //5s
    }
  );

  return response;
};

