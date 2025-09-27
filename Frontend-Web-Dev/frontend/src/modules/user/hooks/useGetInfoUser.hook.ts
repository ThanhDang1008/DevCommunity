"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

import { getInfoUser } from "@/service/api/user";

export const useGetInfoUser = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_INFO_USER],
    queryFn: () => getInfoUser(),
    gcTime: 1000 * 60 * 60, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,// retry when mount component
  });

  return {
    data: data?.data?.data || null,
    isLoading,
    isError,
    error,
  };
};
