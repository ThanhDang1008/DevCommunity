"use client";

import Link from "next/link";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Theme ,useTheme} from "@/components/ThemeContext";
import { Switch } from "antd";

import { Role, queryKeys } from "@/constants/Common";
import ViewAccess from "@ViewAccess";
import { getInfoUser } from "@/service/api/user";

import ModalLogout from "@/components/ui/modal/ModalLogout";

const NameAccount = () => {
  const { theme, toggleTheme} = useTheme();
  const [isOpenModalLogout, setIsOpenModalLogout] = useState(false);
  const {
    data: infoUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_INFO_USER],
    queryFn: () => getInfoUser(),
    gcTime: 1000 * 60 * 10, //thời gian xoá cache khi không sử dụng
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
      <div
        style={{
          marginRight: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 60,
        }}
        className="account"
      >
        <ViewAccess
          error={
            <>
              <Link
                title="Đăng nhập"
                href="/auth/login"
                className={clsx(
                  "bg-violet-950 border border-violet-700 px-4 py-2 rounded-md",
                  "text-sm font-medium text-purple-400 hover:bg-violet-700"
                )}
              >
                Đăng nhập
              </Link>
            </>
          }
          roles={Object.values(Role)}
        >
          {infoUser && infoUser?.data?.data && (
            <p className="text-sm text-gray-500 font-semibold italic mr-2">
              Xin chào{" "}
              <span className="text-purple-400">
                {infoUser?.data?.data?.fullname}
              </span>
            </p>
          )}
          <div className="relative group inline-block text-left">
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

            <ul
              className={clsx(
                "absolute hidden group-hover:block z-10 w-36",
                "bg-[#2e1949cf]  rounded-md shadow-lg",
                "right-[-5px]",
                "border-[1px] border-violet-700"
              )}
            >
              <li
                className={clsx(
                  "text-sm text-purple-500 cursor-pointer rounded-md",
                  "hover:bg-purple-950 hover:text-white"
                )}
              >
                <Link href="/manage/account" className="px-2 py-2 block">
                  <i className="bi bi-person-circle mr-2"></i> Xem hồ sơ
                </Link>
              </li>
              <li
                className={clsx(
                  "text-sm text-purple-500 cursor-pointer rounded-md",
                  "hover:bg-purple-950 hover:text-white"
                )}
              >
                <Link href="/manage/posts/create" className="px-2 py-2 block">
                  <i className="bi bi-send mr-2"></i> Đăng bài
                </Link>
              </li>
              <li
                className={clsx(
                  "text-sm text-purple-500 cursor-pointer rounded-md",
                  "hover:bg-purple-950 hover:text-white"
                )}
              >
                <Link href="/manage/posts/view" className="px-2 py-2 block">
                  <i className="bi bi-file-earmark-text mr-2"></i> Bài viết của
                  tôi
                </Link>
              </li>
              <li
                className={clsx(
                  "text-sm text-purple-500 cursor-pointer rounded-md",
                  "hover:bg-purple-950 hover:text-white"
                )}
              >
                <Switch
                  checkedChildren={<SunOutlined />}
                  unCheckedChildren={<MoonOutlined />}
                  value={theme === Theme.DARK_MODE ? true : false}
                  onChange={(checked: boolean) => {
                    toggleTheme(checked ? Theme.DARK_MODE : Theme.LIGHT_MODE);
                    return;
                  }}
                />
              </li>
              <li
                className={clsx(
                  "text-sm text-red-300 hover:text-white cursor-pointer rounded-md",
                  "hover:bg-red-500",
                  "px-2 py-2 block"
                )}
                onClick={() => {
                  setIsOpenModalLogout(true);
                }}
              >
                <i className="bi bi-box-arrow-right mr-2"></i> Đăng xuất
              </li>
            </ul>
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
