"use client";

import { useState, useMemo } from "react";
import { Users, MessageCircle, UserPlus, Clock } from "lucide-react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";
import { Avatar } from "antd";
import { useRouter } from "next/navigation";

import type { IGroupConversationSummary } from "@/service/api/chat/types/GroupConversations";
import { getAllGroupCommunities } from "@/service/api/chat";
import { useGetInfoUser } from "@/modules/user/hooks";
import { ModalJoinChatGroup } from "@/modules/chat/components/modal/ModalJoinChatGroup";

type TypeChatGroupCommunityItemProps = {
  group: IGroupConversationSummary;
  isJoined: boolean;
  hasRequested: boolean;
};

const ChatGroupsCommunityItem = (props: TypeChatGroupCommunityItemProps) => {
  const [isOpenModalJoinGroup, setIsOpenModalJoinGroup] = useState(false);
  const router = useRouter();

  const getTopicColor = (random: number) => {
    const colors = {
      1: "bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-300",
      2: "bg-purple-100 text-purple-800 dark:bg-purple-900/80 dark:text-purple-300",
      3: "bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-300",
      4: "bg-orange-100 text-orange-800 dark:bg-orange-900/80 dark:text-orange-300",
      5: "bg-pink-100 text-pink-800 dark:bg-pink-900/80 dark:text-pink-300",
      6: "bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-300",
      7: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-300",
      8: "bg-gray-100 text-gray-800 dark:bg-gray-900/80 dark:text-gray-300",
      9: "bg-teal-100 text-teal-800 dark:bg-teal-900/80 dark:text-teal-300",
      10: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/80 dark:text-cyan-300",
      11: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-300",
      12: "bg-lime-100 text-lime-800 dark:bg-lime-900/80 dark:text-lime-300",
      13: "bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-300",
      14: "bg-violet-100 text-violet-800 dark:bg-violet-900/80 dark:text-violet-300",
      15: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };
    return (
      colors[random as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  return (
    <>
      <div
        key={props.group._id}
        className={clsx(
          "relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
          "hover:shadow-xl dark:hover:shadow-gray-900/25 transition-all duration-300",
          "hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1",
          "group cursor-pointer",
          "flex flex-col h-full"
        )}
      >
        {/* Group Avatar Background */}
        {props.group.avatar ? (
          <div className="absolute inset-0">
            <img
              src={props.group.avatar}
              alt={props.group.title}
              className="w-full h-full object-cover opacity-85 dark:opacity-75"
            />
            {/* Gradient overlay để đảm bảo text readable */}
            <div
              className={clsx(
                "absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-white/30 dark:from-gray-800/90 dark:via-gray-800/60 dark:to-gray-800/30"
              )}
            ></div>
          </div>
        ) : (
          <div className="absolute inset-0">
            <img
              src="/image/group_chat_default.png"
              alt="Group background"
              className="w-full h-full object-cover opacity-85 dark:opacity-75"
            />
            {/* Gradient overlay để đảm bảo text readable */}
            <div
              className={clsx(
                "absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-white/30 dark:from-gray-800/90 dark:via-gray-800/60 dark:to-gray-800/30"
              )}
            ></div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 p-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {props.group.avatar ? (
                <img
                  src={props.group.avatar}
                  alt={props.group.title}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-md">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="backdrop-blur-md inline-block px-2 py-1 rounded-full">
                  <h3
                    className={clsx(
                      "text-lg font-bold",
                      "text-gray-800 dark:text-gray-50"
                    )}
                  >
                    {props.group.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                  {props.group.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className={clsx(
                        "inline-block px-2 py-1 rounded-full text-xs font-medium",
                        getTopicColor(Math.floor(Math.random() * 5) + 1)
                      )}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {props?.isJoined && (
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Joined
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
            {props.group.description}
          </p>

          {/* Members */}
          <div className="flex items-center justify-between mb-4">
            <div
              className={clsx(
                "flex items-center gap-2",
                "rounded-lg p-1 backdrop-blur-md"
              )}
            >
              <Avatar.Group
                max={{
                  count: 5,
                  style: {
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                    fontSize: "10px",
                  },
                }}
                size="small"
              >
                {props.group.participants
                  .slice(0, 4)
                  .map((participant, idx) => (
                    <Avatar
                      key={participant.userId?._id}
                      src={participant.userId?.avatar}
                      alt={participant.userId?.fullname}
                      className="ring-0"
                    />
                  ))}
              </Avatar.Group>
              <span className="text-sm text-gray-500 dark:text-gray-300 font-medium">
                {props.group.participants.length} thành viên
              </span>
            </div>

            <div className="flex rounded-full items-center p-1 backdrop-blur-md gap-1 text-gray-500 dark:text-gray-300">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Active</span>
            </div>
          </div>

          {/* Join Button */}
          <button
            onClick={() => {
              if (props.hasRequested) {
                return;
              }
              if (props.isJoined) {
                router.push(`/manage/chat/group/${props?.group?._id}`);
                return;
              }
              setIsOpenModalJoinGroup(true);
            }}
            className={clsx(
              "w-full py-3 px-4 rounded-lg font-medium transition-all duration-200",
              "flex items-center justify-center gap-2 text-sm",
              "group-hover:scale-105 transform",
              "shadow-md hover:shadow-lg",
              "mt-auto",
              {
                "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600":
                  props.hasRequested,
                "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl":
                  !props.hasRequested,
              }
            )}
          >
            {props.isJoined && (
              <>
                <Users className="w-4 h-4" />
                Vào ngay
              </>
            )}
            {!props.isJoined && props.hasRequested && (
              <>
                <Clock className="w-4 h-4" />
                Đã gửi yêu cầu
              </>
            )}
            {!props.isJoined && !props.hasRequested && (
              <>
                <UserPlus className="w-4 h-4" />
                Tham gia ngay
              </>
            )}
          </button>
        </div>
      </div>
      <ModalJoinChatGroup
        isOpen={isOpenModalJoinGroup}
        isPublic={props?.group?.settings?.isPublic}
        groupId={props?.group?._id}
        joinQuestions={props?.group?.settings?.joinQuestions}
        title={
          <span className="text-lg font-semibold">
            Yêu cầu tham gia nhóm{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {props?.group?.title}
            </span>
          </span>
        }
        onOk={() => {
          setIsOpenModalJoinGroup(false);
        }}
        onCancel={() => {
          setIsOpenModalJoinGroup(false);
        }}
      />
    </>
  );
};

const ChatGroupsCommunity = () => {
  const { data: userInfo } = useGetInfoUser();

  const {
    data: groupCommunities,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_ALL_CHAT_GROUP_COMMUNITY],
    queryFn: () => getAllGroupCommunities(),
    gcTime: 1000 * 60 * 30,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const memoizedGroups = useMemo(() => {
    if (
      groupCommunities &&
      groupCommunities?.data &&
      groupCommunities?.data?.data?.length > 0
    ) {
      return groupCommunities.data.data;
    }
    return [];
  }, [groupCommunities]);

  return (
    <>
      <div className="w-full p-4 sm:p-6 bg-slate-50 dark:bg-zinc-900 overflow-y-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Nhóm Chat
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Khám phá và tham gia các nhóm chat phù hợp với sở thích của bạn
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {memoizedGroups.length > 0 &&
            memoizedGroups.map((group, index) => {
              // Tìm xem user hiện tại đã tham gia group chưa
              const isJoined = group.participants.some(
                (participant) => participant?.userId?._id === userInfo?._id
              );
              //đã gửi yêu cầu tham gia
              const hasRequested = group.groupJoinRequestsId.some(
                (request) => (request?.userId as any) === userInfo?._id
              );
              //console.log("hasRequested", hasRequested);

              return (
                <ChatGroupsCommunityItem
                  key={group._id}
                  group={group}
                  isJoined={isJoined}
                  hasRequested={hasRequested}
                />
              );
            })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_: unknown, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-3/4"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                </div>
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && memoizedGroups.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Chưa có nhóm chat nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Hãy tạo nhóm chat đầu tiên của bạn
            </p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mb-4">
              <MessageCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Đã xảy ra lỗi
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              Vui lòng thử lại sau hoặc kiểm tra kết nối mạng của bạn.
            </p>
            {/* <span className="text-xs text-red-400 dark:text-red-300">
                {error instanceof Error ? error.message : "Lỗi không xác định"}
              </span> */}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatGroupsCommunity;
