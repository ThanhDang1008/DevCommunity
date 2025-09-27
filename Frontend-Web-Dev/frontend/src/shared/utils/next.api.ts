"use server";

import queryString from "query-string";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

interface IRequestInit extends RequestInit {
  queryParams?: object;
  body?: any;
}

interface IRequestNextOption {
  cache?: "force-cache" | "no-cache";
  next?: NextFetchRequestConfig | undefined;
}

export type NextResponse<T> = {
  status: number;
  data: T;
};

export const NextAPI = async <T>(
  input: string | URL | globalThis.Request,
  init?: IRequestInit,
  nextOption?: IRequestNextOption
): Promise<NextResponse<T>> => {
  const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;
  const cookie_name_auth = process.env.COOKIE_NAME_AUTH || "token";
  const token = cookieStore.get(cookie_name_auth);

  const options: RequestInit = {
    method: init?.method || "GET",
    headers: new Headers({
      "content-type": "application/json",
      //"Cookie": `${cookie_name_auth}=${token?.value}`,
      ...init?.headers,
    }),
    body: init?.body ? JSON.stringify(init?.body) : undefined,
    credentials: init?.credentials,
    ...nextOption,
  };

  if (init?.queryParams) {
    input = `${input}?${queryString.stringify(init?.queryParams)}`;
  }

  return fetch(input, options)
    .then(async (res) => {
      //console.log("check res", res);//status 200-400
      let data
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      return { status: res.status, data } as NextResponse<T>;
    })
    .catch((err) => {
      // console.log("check err", err);
      throw err;
    });
};
