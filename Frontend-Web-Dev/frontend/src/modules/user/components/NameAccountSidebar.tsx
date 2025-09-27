"use client";

import Link from "next/link";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Role, queryKeys } from "@/constants/Common";
import ViewAccess from "@ViewAccess";
import { getInfoUser } from "@/service/api/user";

import ModalLogout from "@/components/ui/modal/ModalLogout";
import LoginModal from "@/components/ui/modal/ModalLogin";

const NameAccount = () => {
  const [isOpenModalLogout, setIsOpenModalLogout] = useState(false);
  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);

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
    retry: 0,
    retryDelay: 2000,
    retryOnMount: true,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center m-3">
        <ViewAccess
          error={
            <>
              <button
                className={clsx(
                  "w-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white rounded-full font-medium flex justify-center items-center shadow-lg",
                  "hover:from-purple-600 hover:to-purple-800 transition-all duration-300",
                  "p-2"
                )}
                title="Bắt đầu ngay"
                onClick={() => {
                  setIsOpenModalLogin(true);
                }}
              >
                <i className="bi bi-person-circle mr-2"></i>
                Bắt đầu ngay
              </button>

              {isOpenModalLogin && (
                <LoginModal
                  isOpen={isOpenModalLogin}
                  onClose={() => {
                    setIsOpenModalLogin(false);
                  }}
                />
              )}
            </>
          }
          roles={Object.values(Role)}
        >
          <div
            className={clsx(
              "flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-md",
              "border-[2px] border-gray-300 dark:border-gray-700",
              "w-full"
            )}
          >
            <div className="flex items-center justify-start gap-3">
              <img
                src={
                  infoUser?.data?.data?.avatar || "/image/thumbnail_default.jpg"
                }
                alt="Avatar"
                className={clsx(
                  "w-auto h-10 rounded-full cursor-pointer",
                  "border-[3px] border-violet-700 hover:border-violet-500",
                  "transition duration-300 ease-in-out"
                )}
                onError={(e) => {
                  e.currentTarget.src = "/image/thumbnail_default.jpg";
                }}
              />

              {infoUser && infoUser?.data?.data && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold italic mr-2">
                    Xin chào{" "}
                    <span className="text-purple-600 dark:text-purple-400">
                      {infoUser?.data?.data?.fullname}
                    </span>
                  </p>
                  <Link
                    href="/manage/account"
                    className={clsx(
                      "rounded-md",
                      "text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300",
                      "underline"
                    )}
                  >
                    Xem hồ sơ
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/manage/posts/create"
              className={clsx(
                "rounded-md p-2",
                "text-sm font-medium text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-violet-500 hover:text-purple-700 dark:hover:text-white",
                "transition-colors duration-200"
              )}
            >
              <i className="bi bi-send mr-2"></i>
              Đăng bài
            </Link>
            <Link
              href="/manage/posts/view"
              className={clsx(
                "rounded-md p-2",
                "text-sm font-medium text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-violet-500 hover:text-purple-700 dark:hover:text-white",
                "transition-colors duration-200"
              )}
            >
              <i className="bi bi-file-earmark-text mr-2"></i>
              Bài viết của tôi
            </Link>
            <div
              onClick={() => {
                setIsOpenModalLogout(true);
              }}
              className={clsx(
                "rounded-md p-2 cursor-pointer",
                "text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500 hover:text-red-700 dark:hover:text-white",
                "transition-colors duration-200"
              )}
            >
              <i className="bi bi-box-arrow-right mr-2"></i>
              Đăng xuất
            </div>
          </div>
        </ViewAccess>
      </div>
      <ModalLogout
        isOpen={isOpenModalLogout}
        onClose={() => {
          setIsOpenModalLogout(false);
        }}
        isRefresh={false}
      />
    </>
  );
};

export default NameAccount;
