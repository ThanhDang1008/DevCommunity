"use server";

import axios from "@/lib/axiosInstance";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

type LoginResponseError = {
  status: number;
  data: {
    statusCode: number;
    message: string;
    status: string;
  };
};

export const getDataUser = async () => {
  const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;
  const cookie_name_auth = process.env.COOKIE_NAME_AUTH || "token";
  const token = cookieStore.get(cookie_name_auth);
  try {
    const response: any = await axios.get("/api/v1/auth/account", {
      headers: {
        Cookie: `${cookie_name_auth}=${token?.value}`,
      },
      timeout: 5000, //5s
    });
    // const response = await NextAPI<IDataAccount>(
    //   `${process.env.SERVER_URL}/api/v1/auth/data-user`,
    //   {
    //     headers: {
    //       Cookie: `token=${token?.value}`,
    //     },
    //   },
    //   {
    //     next: {
    //       tags: ["account"],
    //     },
    //   }
    // );

    {
      process.env.NODE_ENV === "development" &&
        console.log("(dev) GetDataUser Response:", response);
    }
    return response;
  } catch (error: any) {
    {
      process.env.NODE_ENV === "development" &&
        console.log("(dev) GetDataUser Error:", error);
    }
    //GetDataUser Error: { response: { status: undefined, data: undefined } }
    return error.response;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response: ILoginResponseSuccess = await axios.post(
      "/api/v1/auth/signin",
      {
        email,
        password,
      },
      {
        timeout: 5000,
      }
    );
    //console.log("response:", response);
    // cookies().set({
    //   name: process.env.COOKIE_NAME_AUTH || "token",
    //   value: response.data?.token,
    //   httpOnly: true,
    //   maxAge: Number(process.env.COOKIE_MAX_AGE_AUTH),
    // });
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const loginWithMedia = async (data: {
  email: string;
  fullname: string;
  type: string;
  avatar?: string;
}) => {
  try {
    const response: ILoginResponseSuccess = await axios.post(
      "/api/v1/auth/signin-with-media",
      {
        email: data?.email,
        fullname: data?.fullname,
        type: data?.type,
      },
      {
        timeout: 5000,
      }
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const logout = async () => {
  const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;
  const cookie_name_auth = process.env.COOKIE_NAME_AUTH || "token";
  const token = cookieStore.get(cookie_name_auth);
  try {
    const response = await axios.delete("/api/v1/auth/signout", {
      headers: {
        //Authorization: `Bearer ${token}`,
        Cookie: `${cookie_name_auth}=${token?.value}`,
      },
      timeout: 5000, //5s
    });
    {
      process.env.NODE_ENV === "development" &&
        console.log("(dev) Logout Response:", response);
    }
    return response;
  } catch (error: any) {
    {
      process.env.NODE_ENV === "development" &&
        console.log("(dev) Logout Error:", error);
    }
    return error.response;
  }
};
