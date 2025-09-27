import { AxiosResponse } from "@/lib/axiosInstance";

import type {
  SendResetPassword,
  SendUpdatePassword,
  SendRegister,
} from "./types";
import { generateSignature } from "@/shared/utils/signature";

import { getAxiosInstance } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

export const sendMailResetPassword = async (data: SendResetPassword) => {
  const response: AxiosResponse<any> = await instance.post(
    "/api/v1/mail/reset-password",
    {
      email: data.email,
      name: data.name,
      url_service: data.url_service,
      name_service: data.name_service,
    },
    {
      headers: {
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};

export const sendUpdatePassword = async (data: SendUpdatePassword) => {
  const response: AxiosResponse<any> = await instance.post(
    "/api/v1/mail/update-password",
    {
      new_password: data.new_password,
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

export const sendMailRegister = async (data: SendRegister) => {
  const response: AxiosResponse<any> = await instance.post(
    "/api/v1/mail/register",
    {
      email: data.email,
      name: data.name,
      url_service: data.url_service,
      name_service: data.name_service,
    },
    {
      headers: {
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};
