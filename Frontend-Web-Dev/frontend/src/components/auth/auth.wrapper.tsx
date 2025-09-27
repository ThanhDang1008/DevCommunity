"use client";

import AuthProvider from "./auth.provider";
import { useMemo, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/Common";
import { signOut } from "next-auth/react";
import { setTokenAuth } from "@/components/auth/TokenAuth";
import { setTokenAuth2 } from "@/components/auth/TokenAuth2";
import { useSession } from "next-auth/react";
import { getInfoUser } from "@/service/api/user";
import { getTokenAuth2 } from "@/components/auth/TokenAuth2";

import { getAxiosInstance, AxiosResponse } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

type TypeDataAccountResponse = {
  email: string;
  id_user: string;
  session_id: string;
  id_role: {
    _id: string;
    role: string;
  };
};

const getDataAccount = async () => {
  const token = getTokenAuth2();
  const response: AxiosResponse<TypeDataAccountResponse> = await instance.get(
    "/api/v1/auth/account",
    {
      timeout: 5000, // 5s
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Đảm bảo gửi cookie nếu cần
    }
  );
  return response;
};

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: sessionMedia } = useSession();
  const queryClient = useQueryClient();
  //console.log("sessionMedia out", sessionMedia);

  useEffect(() => {
    const handle = async () => {
      if (sessionMedia && sessionMedia?.customToken) {
        //console.log("sessionMedia in", sessionMedia);
        setTokenAuth(sessionMedia?.customToken);
        setTokenAuth2(sessionMedia?.customToken);

        queryClient.fetchQuery({
          queryKey: [queryKeys.GET_INFO_USER],
          queryFn: () => getInfoUser(),
          gcTime: 1000 * 60 * 60, // 1 hour
          retry: 0,
          retryDelay: 2000,
        });
        queryClient.fetchQuery({
          queryKey: [queryKeys.ACCOUNT],
          queryFn: () => getDataAccount(),
          gcTime: 1000 * 60 * 60, // 1 hour
          retry: 0,
          retryDelay: 2000,
        });
        await signOut({ redirect: false }); //phải đặt ở đây
      }
    };
    if (sessionMedia) {
      handle();
    }
  }, [sessionMedia]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKeys.ACCOUNT],
    queryFn: () => getDataAccount(),
    gcTime: 1000 * 60 * 60,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 0,
    retryDelay: 2000,
    retryOnMount: true,
  });

  //console.log("error", error);

  const dataSession = useMemo(() => {
    if (data?.data) {
      return {
        statusCode: data.status,
        role: (data?.data.id_role.role as any) || null,
      };
    }
    if (error) {
      // Check if error is an AxiosError and has a response
      // response: (500) Internal Server Error
      //   data: undefined;
      //   status: undefined;
      const axiosError = error as any;
      return {
        statusCode: axiosError?.response?.status || 500,
        role: null,
      };
    }

    return null;
  }, [data, error]);

  // const dataSessionMedia = useMemo(() => {
  //   if (sessionMedia?.customToken) {
  //     return {
  //       statusCode: 200,
  //       role: (sessionMedia?.data?.id_role?.role as any) || null,
  //     };
  //   }
  //   return null;
  // }, [sessionMedia]);

  //console.log("dataSession", dataSession);

  return (
    <AuthProvider
      pathLogin="/"
      pathLoginSuccess="/"
      session={
        dataSession
        // dataSession?.statusCode === 200
        //   ? dataSession
        //   : sessionMedia
        //   ? {
        //       statusCode: 200,
        //       role: sessionMedia?.data?.id_role?.role || null,
        //     }
        //   : null
      }
      onCheckSessionSuccess={() => {}}
      onCheckSessionUnauthorized={() => {}}
      onCheckSessionError={() => {}}
    >
      {children}
    </AuthProvider>
  );
};

export { AuthWrapper };
