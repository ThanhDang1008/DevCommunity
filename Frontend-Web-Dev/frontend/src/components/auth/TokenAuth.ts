"use server";

import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

// import { NextAPI } from "@/utils/next.api";
// import axios from "@/lib/axiosInstance";
// import { URL } from "@/constants/Common";

//------------------------------------------------------------------//

// const key =
//   process.env.LOCALSTORAGE_KEY ||
//   process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY ||
//   "token";
// export let token2 =
//   typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;

export const getTokenAuth = async () => {
  // const key =
  //   process.env.LOCALSTORAGE_KEY ||
  //   process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY ||
  //   "token";
  // let token =
  //   typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  // return token;
  // const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;
  // const cookie_name_auth = process.env.COOKIE_NAME_AUTH || "token";
  // const token = cookieStore.get(cookie_name_auth)?.value || null;
  return "";
};

export const setTokenAuth = async (token: string) => {
  // const key =
  //   process.env.LOCALSTORAGE_KEY ||
  //   process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY ||
  //   "token";
  // // set token to localStorage
  // if (typeof localStorage !== "undefined") {
  //   localStorage.setItem(key, token);
  // }
  const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;
  const cookie_name_auth = process.env.COOKIE_NAME_AUTH || "token";
  cookieStore.set(cookie_name_auth, token, {
    maxAge: process.env.COOKIE_EXPIRES_IN
      ? Number(process.env.COOKIE_EXPIRES_IN)
      : 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
    priority: "high",
  });
};

export const removeTokenAuth = async () => {
  // const key =
  //   process.env.LOCALSTORAGE_KEY ||
  //   process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY ||
  //   "token";
  // if (typeof localStorage !== "undefined") {
  //   localStorage.removeItem(key);
  // }
  const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;
  const cookie_name_auth = process.env.COOKIE_NAME_AUTH || "token";
  cookieStore.delete(cookie_name_auth);
};
