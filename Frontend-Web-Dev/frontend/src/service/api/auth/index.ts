import { generateSignature } from "@/shared/utils/signature";

import { getAxiosInstance } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

export const register = async (data: {
  fullname: string;
  password: string;
  token: string;
}) => {
  const response = await instance.post(
    "/api/v1/auth/register",
    {
      fullname: data.fullname,
      password: data.password,
      token: data.token,
    },
    {
      headers: {
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};
