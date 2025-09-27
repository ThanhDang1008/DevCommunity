import axios from "axios";
import { getTokenAuth2 } from "@/components/auth/TokenAuth2";

export const baseURL =
  process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL;

export type AxiosResponse<T> = {
  status: number;
  data: T;
};

// const key =
//   process.env.LOCALSTORAGE_KEY ||
//   process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY ||
//   "token";
// let token =
//   typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
const token = getTokenAuth2();

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // send cookies with cross-domain requests
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    //return response;
    return Promise.resolve({
      status: response?.status,
      data: response?.data,
    }) as any;
  },
  function (error) {
    // Any status codes that falls outside the range of 4xx cause this function to trigger
    // Do something with response error
    return Promise.reject({
      response: {
        status: error.response?.status,
        data: error.response?.data,
      },
    });
  }
);

export default instance;

export const getAxiosInstance = () => {
  const token = getTokenAuth2();

  const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true, // send cookies with cross-domain requests
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Add a request interceptor
  instance.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      //return response;
      return Promise.resolve({
        status: response?.status,
        data: response?.data,
      }) as any;
    },
    function (error) {
      // Any status codes that falls outside the range of 4xx cause this function to trigger
      // Do something with response error
      return Promise.reject({
        response: {
          status: error.response?.status,
          data: error.response?.data,
        },
      });
    }
  );

  return instance;
};
