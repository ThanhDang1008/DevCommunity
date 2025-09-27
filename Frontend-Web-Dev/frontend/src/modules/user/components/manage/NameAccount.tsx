"use client";

import Link from "next/link";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { queryKeys } from "@/constants/Common";
import { getInfoUser } from "@/service/api/user";

const NameAccount = () => {
  const {
    data: infoUser,
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
    retryOnMount: true,
  });
  return (
    <>
      <div className="flex items-center gap-2">
        <Avatar size={24} icon={<UserOutlined />} />
        {infoUser && infoUser?.data?.data && (
          <p className="text-sm text-gray-500 font-semibold italic mr-2">
            Xin chào{" "}
            <span className="text-purple-400">
              {infoUser?.data?.data?.fullname}
            </span>
          </p>
        )}
      </div>
    </>
  );
};

export default NameAccount;
