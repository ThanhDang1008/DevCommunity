"use client";

import { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

import { logout } from "@/components/auth/actions";
import { queryKeys } from "@/constants/Common";
import { removeTokenAuth } from "@/components/auth/TokenAuth";
import { removeTokenAuth2 } from "@/components/auth/TokenAuth2";
import { socketChatService } from "@/service/socket/chat/socketInstance";

const useLogout = () => {
  const queryClient = useQueryClient();
  const {
    mutate: logoutMutation,
    data,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: () => logout(),
    onSuccess: async (data) => {
      //console.log("data onSuccess", data);
      await removeTokenAuth();
      removeTokenAuth2();
      await signOut({ redirect: false });
      socketChatService.removeAllListeners();
      socketChatService.disconnect();
      // queryClient.setQueryData([queryKeys.INFO_USER], null);
    },

    onError: (error: any) => {
      {
        process.env.NODE_ENV === "development" &&
          console.log("(dev) Đăng xuất lỗi: ", error);
      }
    },
  });

  return {
    logout: () => {
      logoutMutation();
    },
    data,
    isPending,
    isError,
    error,
  };
};

export default useLogout;
