"use client";

import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  X,
  MoreHorizontal,
  Clock,
  RefreshCcw,
  UserMinus,
} from "lucide-react";
import clsx from "clsx";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";
import {
  getListRecommendFriend,
  getListFriendRequestsSender,
  getListFriendRequestsReceiver,
} from "@/service/api/user";
import { ModalAddFriend } from "@/modules/user/components/modal/ModalAddFriend";
import { ModalCancelAddFriend } from "@/modules/user/components/modal/ModalCancelAddFriend";
import { EnumFriendRequestStatus } from "@/service/api/user/types/FriendRequests";

export default function FriendSuggestions() {
  const [isOpenModalAddFriend, setIsOpenModalAddFriend] = useState(false);
  const [infoUserAddFriend, setInfoUserAddFriend] = useState<{
    id: string;
    fullname: string;
    avatar: string;
  }>({
    id: "",
    fullname: "",
    avatar: "",
  });

  const [isOpenModalCancelAddFriend, setIsOpenModalCancelAddFriend] =
    useState(false);
  const [infoUserCancelAddFriend, setInfoUserCancelAddFriend] = useState<{
    id: string;
    fullname: string;
    avatar: string;
  }>({
    id: "",
    fullname: "",
    avatar: "",
  });
  const queryClient = useQueryClient();

  const {
    data: listRecommendFriend,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_LIST_RECOMMEND_FRIEND],
    queryFn: () => getListRecommendFriend(1, 10),
    gcTime: 1000 * 60 * 30, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const listRecommendFriendData = useMemo(
    () => listRecommendFriend?.data?.data ?? [],
    [listRecommendFriend]
  );

  const {
    data: listFriendRequestsSender,
    isLoading: isLoadingFriendRequestsSender,
    isError: isErrorFriendRequestsSender,
    error: errorFriendRequestsSender,
  } = useQuery({
    queryKey: [queryKeys.GET_LIST_FRIEND_REQUESTS_SENDER],
    queryFn: () => getListFriendRequestsSender(1, 10),
    gcTime: 1000 * 60 * 30, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const listFriendRequestsSenderData = useMemo(() => {
    return (
      listFriendRequestsSender?.data?.data
        ?.filter(
          (request) => request.status === EnumFriendRequestStatus.PENDING
        )
        .map((request) => request.receiverId) ?? []
    );
  }, [listFriendRequestsSender]);

  const {
    data: listFriendRequestsReceiver,
    isLoading: isLoadingFriendRequestsReceiver,
    isError: isErrorFriendRequestsReceiver,
    error: errorFriendRequestsReceiver,
  } = useQuery({
    queryKey: [queryKeys.GET_LIST_FRIEND_REQUESTS_RECEIVER],
    queryFn: () => getListFriendRequestsReceiver(1, 10),
    gcTime: 1000 * 60 * 30, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const listFriendRequestsReceiverData = useMemo(
    () => listFriendRequestsReceiver?.data?.data ?? [],
    [listFriendRequestsReceiver]
  );
 // console.log("listFriendRequestsReceiverData", listFriendRequestsReceiverData);

  //console.log("listFriendRequests", listFriendRequests);

  //console.log("listReceiverIdPending", listReceiverIdPending);

  //console.log("listRecommendFriend", listRecommendFriend);

  if (false) {
    return (
      <div
        className={clsx(
          "w-full p-6",
          "bg-white dark:bg-zinc-900",
          "rounded-xl shadow-lg",
          "border border-gray-200 dark:border-zinc-700"
        )}
      >
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 dark:text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Không còn gợi ý nào
          </h3>
          <p className="text-gray-500 dark:text-zinc-400">
            Bạn đã xem hết tất cả gợi ý kết bạn. Hãy quay lại sau!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={clsx(
          "w-full p-6",
          "bg-white dark:bg-zinc-900",
          "rounded-xl shadow-lg",
          "border border-gray-200 dark:border-zinc-700"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 w-full">
          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Đề xuất kết bạn
          </h2>
          <span
            className={clsx(
              "px-2 py-1 text-sm font-medium rounded-full",
              "bg-blue-100 dark:bg-blue-900",
              "text-blue-800 dark:text-blue-200"
            )}
          >
            {listRecommendFriendData.length} gợi ý
          </span>
          <button
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_LIST_RECOMMEND_FRIEND],
              });
              queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_LIST_FRIEND_REQUESTS_SENDER],
              });
            }}
            className={clsx(
              "ml-auto px-3 py-2 rounded-lg",
              "bg-gray-200 dark:bg-zinc-700",
              "hover:bg-gray-300 dark:hover:bg-zinc-600",
              "text-gray-700 dark:text-zinc-300",
              "transition-colors duration-200"
            )}
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listRecommendFriendData.map((friend) => {
            // kiểm tra xem người dùng đã gửi lời mời kết bạn hay chưa
            const isPending = listFriendRequestsSenderData.some(
              (receiver: { _id: string }) => receiver?._id === friend?._id
            );

            //đã có người khác gửi lời mời kết bạn
            const isRequested = listFriendRequestsReceiverData.some(
              (request) =>
                request?.senderId?._id === friend._id &&
                request.status === EnumFriendRequestStatus.PENDING
            );
            return (
              <div
                key={friend._id}
                className={clsx(
                  "relative group",
                  "bg-gray-50 dark:bg-zinc-800",
                  "rounded-xl p-6",
                  "border border-gray-200 dark:border-zinc-700",
                  "hover:shadow-md dark:hover:shadow-zinc-900/20",
                  "transition-all duration-200",
                  "hover:border-blue-300 dark:hover:border-blue-600"
                )}
              >
                {/* Remove Button */}
                <button
                  onClick={() => {}}
                  className={clsx(
                    "absolute top-3 right-3 opacity-0 group-hover:opacity-100",
                    "w-8 h-8 rounded-full",
                    "bg-gray-200 dark:bg-zinc-700",
                    "hover:bg-gray-300 dark:hover:bg-zinc-600",
                    "flex items-center justify-center",
                    "transition-all duration-200"
                  )}
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                </button>

                {/* Avatar */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.fullname}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-700 shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-zinc-800"></div>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                    {friend.fullname}
                  </h3>

                  {/* {friend.bio && (
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2 line-clamp-2">
                  {friend.bio}
                </p>
              )} */}

                  {/* <div className="space-y-1">
                {friend.workplace && (
                  <p className="text-sm text-gray-500 dark:text-zinc-500">
                    🏢 {friend.workplace}
                  </p>
                )}
                {friend.location && (
                  <p className="text-sm text-gray-500 dark:text-zinc-500">
                    📍 {friend.location}
                  </p>
                )}
              </div> */}
                  {/* 
              <div
                className={clsx(
                  "mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                  "bg-blue-100 dark:bg-blue-900",
                  "text-blue-700 dark:text-blue-300"
                )}
              >
                <Users className="w-3 h-3" />
                {friend.mutualFriends} bạn chung
              </div> */}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (isPending) {
                        setIsOpenModalCancelAddFriend(true);
                        setInfoUserCancelAddFriend({
                          id: friend._id,
                          fullname: friend.fullname,
                          avatar: friend.avatar,
                        });
                        return;
                      }
                      if (isRequested) {
                        message.warning(
                          "Vui lòng đợi xác nhận từ người dùng này"
                        );
                        return;
                      }
                      setIsOpenModalAddFriend(true);
                      setInfoUserAddFriend({
                        id: friend._id,
                        fullname: friend.fullname,
                        avatar: friend.avatar,
                      });
                    }}
                    disabled={isRequested}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
                      "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
                      "text-white font-medium text-sm",
                      "transition-colors duration-200",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      {
                        "bg-gray-300 dark:bg-zinc-600 hover:bg-gray-400 dark:hover:bg-zinc-500":
                          isPending,
                      }
                    )}
                  >
                    {isPending && (
                      <>
                        <UserMinus className="w-4 h-4" /> Huỷ yêu cầu
                      </>
                    )}
                    {isRequested && (
                      <>
                        <Clock className="w-4 h-4" /> Đang chờ xác nhận
                      </>
                    )}
                    {!isPending && !isRequested && (
                      <>
                        <UserPlus className="w-4 h-4" /> Kết bạn
                      </>
                    )}
                  </button>

                  <button
                    className={clsx(
                      "px-3 py-2 rounded-lg",
                      "bg-gray-200 dark:bg-zinc-700",
                      "hover:bg-gray-300 dark:hover:bg-zinc-600",
                      "text-gray-700 dark:text-zinc-300",
                      "transition-colors duration-200"
                    )}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            className={clsx(
              "px-6 py-3 rounded-lg",
              "bg-gray-100 dark:bg-zinc-800",
              "hover:bg-gray-200 dark:hover:bg-zinc-700",
              "text-gray-700 dark:text-zinc-300",
              "font-medium",
              "transition-colors duration-200"
            )}
          >
            Xem thêm gợi ý
          </button>
        </div>
      </div>
      {isOpenModalAddFriend && (
        <ModalAddFriend
          isOpen={isOpenModalAddFriend}
          title={"Gửi lời mời kết bạn"}
          onCancel={() => {
            setIsOpenModalAddFriend(false);
            setInfoUserAddFriend({ id: "", fullname: "", avatar: "" });
          }}
          onOk={() => {
            setIsOpenModalAddFriend(false);
            setInfoUserAddFriend({ id: "", fullname: "", avatar: "" });
            queryClient.invalidateQueries({
              queryKey: [queryKeys.GET_LIST_FRIEND_REQUESTS_SENDER],
            });
          }}
          friendId={infoUserAddFriend.id}
          friendName={infoUserAddFriend.fullname}
          friendAvatar={infoUserAddFriend.avatar}
        />
      )}
      {isOpenModalCancelAddFriend && (
        <ModalCancelAddFriend
          isOpen={isOpenModalCancelAddFriend}
          title={"Hủy lời mời kết bạn"}
          onCancel={() => {
            setIsOpenModalCancelAddFriend(false);
            setInfoUserCancelAddFriend({ id: "", fullname: "", avatar: "" });
          }}
          onOk={() => {
            setIsOpenModalCancelAddFriend(false);
            setInfoUserCancelAddFriend({ id: "", fullname: "", avatar: "" });
            queryClient.invalidateQueries({
              queryKey: [queryKeys.GET_LIST_FRIEND_REQUESTS_SENDER],
            });
          }}
          friendId={infoUserCancelAddFriend.id}
          friendName={infoUserCancelAddFriend.fullname}
          friendAvatar={infoUserCancelAddFriend.avatar}
        />
      )}
    </>
  );
}
