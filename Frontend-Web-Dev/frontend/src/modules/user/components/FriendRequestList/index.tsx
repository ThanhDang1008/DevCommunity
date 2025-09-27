"use client";

import { useState, useMemo } from "react";
import clsx from "clsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";
import { RefreshCcw } from "lucide-react";

import { getListFriendRequestsReceiver } from "@/service/api/user";
import { ModalFeedbackAddFriend } from "@/modules/user/components/modal/ModalFeedbackAddFriend";

const FriendRequestList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoFeedback, setInfoFeedback] = useState<{
    requestId: string;
    accepted: boolean;
    friendId?: string;
    friendName?: string;
    friendAvatar?: string;
  }>({
    requestId: "",
    accepted: false,
    friendId: "",
    friendName: "",
    friendAvatar: "",
  });

  const queryClient = useQueryClient();
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

  //console.log("listFriendRequestsReceiver", listFriendRequestsReceiver);

  const listFriendRequestsReceiverData = useMemo(() => {
    return listFriendRequestsReceiver?.data?.data || [];
  }, [listFriendRequestsReceiver]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} ngày trước`;
    } else if (diffHours > 0) {
      return `${diffHours} giờ trước`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} phút trước`;
    } else {
      return "Vừa xong";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div
        className={clsx(
          "bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800",
          "w-full max-w-2xl mx-auto" // Responsive container
        )}
      >
        <div className="flex px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Yêu cầu kết bạn
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {listFriendRequestsReceiverData.length} yêu cầu đang chờ
            </p>
          </div>
          <button
            className={clsx(
              "flex items-center space-x-2 px-2 py-1 text-sm font-medium rounded-md transition-colors",
              "bg-zinc-100 hover:bg-zinc-200 text-zinc-700",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300",
              "ml-auto"
            )}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_LIST_FRIEND_REQUESTS_RECEIVER],
              });
            }}
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {listFriendRequestsReceiverData.map((request) => {
            return (
              <div
                key={request?._id}
                className="p-4 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                    <div className="flex-shrink-0">
                      {request?.senderId?.avatar ? (
                        <img
                          src={request?.senderId?.avatar}
                          alt={request?.senderId?.fullname}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {getInitials(request?.senderId?.fullname)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {request?.senderId?.fullname}
                        </h3>
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">
                          @{request?.senderId?.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-zinc-600 dark:text-zinc-400">
                        {/* {request.mutualFriends && request.mutualFriends > 0 && (
                  <span className="flex items-center space-x-1">
                    <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{request.mutualFriends} bạn chung</span>
                  </span>
                  )} */}
                        <span>{formatTimeAgo(String(request.createdAt))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setInfoFeedback({
                          requestId: request?._id,
                          accepted: true,
                          friendId: request?.senderId?._id,
                          friendName: request?.senderId?.fullname,
                          friendAvatar: request?.senderId?.avatar,
                        });
                        setIsModalOpen(true);
                      }}
                      className={clsx(
                        "flex-1 sm:flex-none px-4 py-2.5 sm:py-2 text-sm sm:text-xs font-medium rounded-md transition-colors",
                        "bg-blue-600 hover:bg-blue-700 text-white",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "dark:bg-blue-500 dark:hover:bg-blue-600"
                      )}
                    >
                      Chấp nhận
                    </button>
                    <button
                      onClick={() => {
                        setInfoFeedback({
                          requestId: request?._id,
                          accepted: false,
                          friendId: request?.senderId?._id,
                          friendName: request?.senderId?.fullname,
                          friendAvatar: request?.senderId?.avatar,
                        });
                        setIsModalOpen(true);
                      }}
                      className={clsx(
                        "flex-1 sm:flex-none px-4 py-2.5 sm:py-2 text-sm sm:text-xs font-medium rounded-md transition-colors",
                        "bg-zinc-200 hover:bg-zinc-300 text-zinc-800",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200"
                      )}
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isModalOpen && (
        <ModalFeedbackAddFriend
          isOpen={isModalOpen}
          requestId={infoFeedback.requestId}
          accepted={infoFeedback.accepted}
          friendId={infoFeedback.friendId}
          friendName={infoFeedback.friendName}
          friendAvatar={infoFeedback.friendAvatar}
          onOk={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({
              queryKey: [queryKeys.GET_LIST_FRIEND_REQUESTS_RECEIVER],
            });
            queryClient.invalidateQueries({
              queryKey: [queryKeys.GET_LIST_RECOMMEND_FRIEND],
            });
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default FriendRequestList;
