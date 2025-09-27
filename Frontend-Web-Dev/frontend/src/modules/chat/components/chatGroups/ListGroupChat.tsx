"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Pin, Users, Plus, RefreshCcw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { message as messageAntd } from "antd";

import type { IGroupMessages } from "@/service/api/chat/types/GroupMessages";
import type { GetListGroupConversationsResponse } from "@/service/api/chat/types/GroupConversations";
import type { AxiosResponse } from "@/lib/axiosInstance";
import type { GroupConversationWithoutDefaultPermissions } from "@/service/api/chat/types/GroupConversations";

import { queryKeys } from "@/constants/Common";
import { getAllChatGroup } from "@/service/api/chat";
import { useGetInfoUser } from "@/modules/user/hooks";
import { socketChatService } from "@/service/socket/chat/socketInstance";
import { ChatEvent } from "@/service/socket/chat/constants/Common";
import { readNewMessagesGroup } from "@/service/api/chat";
import { useLayoutChatContext } from "../LayoutChat";
import { ModalCreateChatGroup } from "@/modules/chat/components/modal/ModalCreateChatGroup";
import { formatTimeChatItem } from "@/shared/utils/time";

interface ChatItemProps {
  chat: GroupConversationWithoutDefaultPermissions;
  onClick: (id: string) => void;
  listUserIsTyping: {
    userId: string;
    fullname: string;
    isTyping: boolean;
    groupId: string;
  }[];
}

const readMessagesGroup = ({
  groupId,
  queryClient,
  onSuccess,
  onError,
}: {
  groupId: string;
  queryClient: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { mutate: readNewMessagesGroupMutation, isPending } = useMutation({
    mutationFn: (data: { groupId: string }) => readNewMessagesGroup(data),
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
      queryClient.setQueryData(
        [queryKeys.GET_ALL_CHAT_GROUP],
        (oldData: any) => {
          if (!oldData || !oldData.data || !oldData.data.data) return oldData;
          const updatedData = oldData?.data?.data.map((item: any) => {
            if (item._id === groupId) {
              return {
                ...item,
                unreadCount: 0, // Reset unread count
              };
            }
            return item;
          });
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedData,
            },
          };
        }
      );
    },
    onError: (error: any) => {
      if (onError) {
        onError(error);
      }
    },
    retry: 3,
    retryDelay: 2000,
  });

  return {
    read: (data: { groupId: string }) => readNewMessagesGroupMutation(data),
    isPending,
  };
};

const ChatItem = (props: ChatItemProps) => {
  const queryClient = useQueryClient();
  const { groupId, groupIdRef, setGroupId } = useLayoutChatContext();
  const { data: userInfo } = useGetInfoUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQuery = (newParams: { [key: string]: string | null }) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`?${params.toString()}`);
  };

  const { read, isPending } = readMessagesGroup({
    groupId: props.chat._id,
    queryClient: queryClient,
    onSuccess: (data) => {},
    onError: (error) => {},
  });

  return (
    <div
      className={clsx(
        "flex items-center px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800 group relative",
        {
          "bg-blue-50 dark:bg-zinc-800 border-r-2 border-blue-500":
            props.chat._id === groupId,
          "bg-gray-50/50 dark:bg-gray-800/30":
            !groupId &&
            props.chat.participants.find(
              (participant) => participant?.userId?._id === userInfo?._id
            )?.isPinned,
        }
      )}
      onClick={() => {
        props.onClick(props.chat._id);
        //setGroupId(props.chat._id); // Cập nhật groupId trong context
        router.push(`/manage/chat/group/${props.chat._id}`);
        groupIdRef.current = props.chat._id; // Cập nhật ref để tránh lỗi khi sử dụng trong socket
        read({
          groupId: props.chat._id,
        });
      }}
      //   onContextMenu={(e) => onContextMenu(chat.id, e)}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0 mr-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-xl shadow-md">
          {props.chat.avatar ? (
            <img
              src={props.chat.avatar}
              alt={props.chat.title}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            props.chat.title.charAt(0).toUpperCase()
          )}
        </div>

        {/* Online indicator */}

        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"></div>

        {/* Pinned indicator */}
        {props.chat.participants.find(
          (participant) => participant?.userId?._id === userInfo?._id
        )?.isPinned && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-200 dark:bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
            <Pin className="w-3 h-3 text-slate-500 dark:text-white" />
          </div>
        )}
      </div>

      {/* Chat content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center min-w-0 flex-1">
            <h3
              className={clsx(
                "font-semibold text-base truncate mr-2",
                props.chat.unreadCount > 0
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-200"
              )}
            >
              {props.chat.title}
            </h3>

            {/* Status icons */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />

              {props.chat.participants.find(
                (participant) => participant?.userId?._id === userInfo?._id
              )?.notification?.is_muted && (
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Read status */}

            <div className="flex space-x-0.5">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            </div>

            {/* Time */}
            <span
              className={clsx(
                "text-sm font-medium",
                props.chat.unreadCount > 0
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {formatTimeChatItem(props.chat?.lastMessageId?.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {props.listUserIsTyping.length > 0 ? (
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <div className="flex space-x-1 mr-2">
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {props.listUserIsTyping
                    .map((user) => user.fullname)
                    .join(", ")}{" "}
                  đang gõ...
                </span>
              </div>
            ) : (
              <p
                className={clsx(
                  "text-sm truncate",
                  props.chat.unreadCount > 0
                    ? "text-gray-800 dark:text-gray-200 font-medium"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                {props.chat.lastMessageId &&
                  props.chat?.lastMessageId?.senderId?._id !== userInfo?._id && (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {props.chat?.lastMessageId?.senderId?.fullname || ""}:
                    </span>
                  )}
                {props.chat.lastMessageId &&
                  props.chat?.lastMessageId?.senderId?._id === userInfo?._id && (
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      Bạn:
                    </span>
                  )}
                {!props.chat.lastMessageId && (
                  <span className="text-gray-500 dark:text-gray-400 italic">
                    Hãy gửi tin nhắn đầu tiên
                  </span>
                )}
                {!props?.chat?.lastMessageId?.isDeleted && (
                  <span className={"ml-1"}>
                    {props.chat?.lastMessageId?.content?.text}

                    {!props.chat?.lastMessageId?.content?.text &&
                      Array.isArray(
                        props.chat?.lastMessageId?.content?.media?.fileId
                      ) &&
                      props.chat?.lastMessageId?.content?.media?.fileId.length >
                        0 &&
                      `Đã gửi ${props.chat?.lastMessageId?.content?.media?.fileId.length} tệp`}
                  </span>
                )}
                {props.chat?.lastMessageId?.isDeleted && (
                  <span className="ml-1 italic text-red-500 dark:text-red-400">
                    (Tin nhắn đã bị thu hồi)
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Unread count */}
          {props.chat.unreadCount > 0 && (
            <div
              className={clsx(
                "ml-3 text-white text-xs rounded-full min-w-[22px] h-5.5 flex items-center justify-center px-2 font-medium shadow-sm",
                props.chat.participants.find(
                  (participant) => participant?.userId?._id === userInfo?._id
                )?.notification?.is_muted
                  ? "bg-gray-400 dark:bg-gray-500"
                  : "bg-blue-500 dark:bg-blue-600"
              )}
            >
              {props.chat.unreadCount > 999 ? "999+" : props.chat.unreadCount}
            </div>
          )}
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center space-x-1">
          {!props.chat.participants.find(
            (participant) => participant?.userId?._id === userInfo?._id
          )?.isPinned && (
            // <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            //   <svg
            //     className="w-4 h-4 text-gray-500 dark:text-gray-400"
            //     fill="currentColor"
            //     viewBox="0 0 20 20"
            //   >
            //     <path
            //       fillRule="evenodd"
            //       d="M8 2a2 2 0 00-2 2v1.5a.5.5 0 01-.5.5h-1a.5.5 0 000 1h1A.5.5 0 016 7.5V9a2 2 0 002 2h4a2 2 0 002-2V7.5a.5.5 0 01.5-.5h1a.5.5 0 000-1h-1a.5.5 0 01-.5-.5V4a2 2 0 00-2-2H8z"
            //       clipRule="evenodd"
            //     />
            //   </svg>
            // </button>
            <></>
          )}

          <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

type HeaderListGroupChatProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const HeaderListGroupChat = (props: HeaderListGroupChatProps) => {
  const queryClient = useQueryClient();
  const [isOpenModalCreateChatGroup, setIsOpenModalCreateChatGroup] =
    useState<boolean>(false);
  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tin nhắn
          </h2>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsOpenModalCreateChatGroup(true)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: [queryKeys.GET_ALL_CHAT_GROUP],
                });
              }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <RefreshCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={props.searchQuery}
            onChange={(e) => props.setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <svg
            className="absolute left-3 top-3 w-4 h-4 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {isOpenModalCreateChatGroup && (
        <ModalCreateChatGroup
          isOpen={isOpenModalCreateChatGroup}
          onCancel={() => setIsOpenModalCreateChatGroup(false)}
          title="Tạo nhóm trò chuyện"
          onOk={() => {
            setIsOpenModalCreateChatGroup(false);
          }}
        />
      )}
    </>
  );
};

type ListGroupChatProps = {};

const ListGroupChat = (props: ListGroupChatProps) => {
  const queryClient = useQueryClient();
  const { groupId, groupIdRef, isConnected, isReConnected, retryConnection } =
    useLayoutChatContext();
  const { setListChatGroupId } = useLayoutChatContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [listUserIsTyping, setListUserIsTyping] = useState<
    { groupId: string; userId: string; fullname: string; isTyping: boolean }[]
  >([]);
  //console.log("ListGroupChat", groupId);

  // const [dataChatGroupList, setDataChatGroupList] = useState<
  //   GroupConversationWithoutDefaultPermissions[]
  // >([]);

  const {
    data: chatGroupList,
    isLoading: isLoadingChatGroupList,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_ALL_CHAT_GROUP],
    queryFn: () => getAllChatGroup(),
    gcTime: 1000 * 60 * 60, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });
  //console.log("ChatGroupList", ChatGroupList);

  useEffect(() => {
    if (chatGroupList?.data?.data) {
      // setDataChatGroupList(chatGroupList.data.data);
      setListChatGroupId(
        chatGroupList?.data?.data?.map((chat) => chat._id || "") || []
      );
    }
  }, [chatGroupList]);

  useEffect(() => {
    if (!queryClient) return;
    //--------- only listen to the specific group chat event

    //console.log("Listening to chat group last message event");
    const event = `${ChatEvent.CHAT_GROUP_LAST_MESSAGE}`;
    type LastMessage = {
      groupId: string;
      lastMessageId: IGroupMessages;
    };
    socketChatService.on(event, (data: LastMessage) => {
      //console.log(`${event}`, data);

      //cập nhật dữ liệu trong cache nếu groupId của socket nhận được trùng với groupId hiện tại trong
      queryClient.setQueryData(
        [queryKeys.GET_ALL_CHAT_GROUP],
        (oldData: AxiosResponse<GetListGroupConversationsResponse>) => {
          if (!oldData || !oldData.data || !oldData.data.data) return oldData;
          const updatedData = oldData?.data?.data.map((item) => {
            if (item._id === data.groupId) {
              // Nếu messageId giống nhau thì không cập nhật (tránh trùng lặp)
              if (item?.lastMessageId?._id === data?.lastMessageId?._id) {
                return item;
              }
              // console.log(">>>>>>", data.groupId === groupIdRef.current);
              // console.log(">>>>> groupId", groupIdRef.current);
              // console.log(">>>>> data.groupId", data.groupId);
              // Nếu đang ở trong phòng groupId thì không cộng unreadCount
              if (data.groupId === groupIdRef.current) {
                // Cập nhật trạng thái đã đọc tin nhắn mới
                readNewMessagesGroup({
                  groupId: data.groupId,
                }); //cập nhật dưới databse
                return {
                  ...item,
                  lastMessageId: data.lastMessageId, // Cập nhật lastMessageId
                };
              }
              return {
                ...item,
                unreadCount: (item.unreadCount || 0) + 1,
                lastMessageId: data.lastMessageId, // Cập nhật lastMessageId
              };
            }
            return item;
          });
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedData,
            },
          };
        }
      );

      // queryClient.setQueryData(
      //   [queryKeys.GET_ALL_CHAT_GROUP],
      //   (oldData: any) => {
      //     if (!oldData || !oldData.data || !oldData.data.data) return oldData;
      //     const updatedData = oldData?.data?.data.map((item: any) => {
      //       if (item._id === data.groupId) {
      //         //nếu groupId của socket nhận được trùng với groupId hiện tại
      //         if (data.groupId === groupId) {
      //           if (item.lastMessageId?._id === data.messageId) {
      //             return item;
      //           }
      //           console.log("groupId socket", data.groupId);
      //           console.log("groupId current", groupId);
      //           //nếu user đang ở trong group chat nhận socket
      //           readNewMessagesGroup({
      //             groupId: data.groupId,
      //           }); //cập nhật dưới databse
      //           return {
      //             ...item,
      //             // unreadCount: 0,
      //             lastMessageId: {
      //               ...item.lastMessageId,
      //               content: { text: data.content.text },
      //               senderId: {
      //                 _id: data.userId,
      //                 fullname: data.fullname,
      //               },
      //               createdAt: new Date().toISOString(),
      //             },
      //             participants: item.participants.map((p: any) =>
      //               p.userId?._id === data.userId
      //                 ? {
      //                     ...p,
      //                     lastReadAt: new Date().toISOString(),
      //                   }
      //                 : p
      //             ),
      //           };
      //         } else {
      //           //nếu user không ở trong group chat nhận socket
      //           // Nếu messageId giống nhau thì không thực hiện
      //           if (item.lastMessageId?._id === data.messageId) {
      //             return item;
      //           }
      //           return {
      //             ...item,
      //             unreadCount: item.unreadCount + 1,
      //             lastMessageId: {
      //               ...item.lastMessageId,
      //               _id: data.messageId,
      //               content: { text: data.content.text },
      //               senderId: {
      //                 _id: data.userId,
      //                 fullname: data.fullname,
      //               },
      //               createdAt: new Date().toISOString(),
      //             },
      //           };
      //         }
      //       }
      //       return item;
      //     });
      //     return {
      //       ...oldData,
      //       data: {
      //         ...oldData.data,
      //         data: updatedData,
      //       },
      //     };
      //   }
      // );
    });

    return () => {
      //socketChatService.off(event);
    };
  }, [groupIdRef, queryClient]);

  return (
    <div
      className={clsx(
        "w-full border shadow-lg h-screen flex flex-col",
        "bg-white dark:bg-zinc-900 border-gray-200 dark:border-gray-700",
        `${
          window.location.pathname.includes("/manage/chat/group/")
            ? "mt-0"
            : "mt-12"
        }`
      )}
    >
      {/* Header */}
      <HeaderListGroupChat
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
        {isConnected === false && !isReConnected && (
          <div className="p-2 text-red-500 text-center bg-red-50 dark:bg-red-900/50">
            Mất kết nối với máy chủ. Vui lòng kiểm tra kết nối hoặc thử lại sau.
            <br />
            <button
              className="mt-1 py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              onClick={() => {
                retryConnection(); // Gọi hàm để thử kết nối lại
              }}
            >
              Thử lại
            </button>
          </div>
        )}
        {isConnected === false && isReConnected && (
          // Hiển thị thông báo đang kết nối lại
          <div className="p-2 text-green-500 text-center bg-green-100 dark:bg-green-900/50">
            Đang kết nối lại...
          </div>
        )}
        {!isLoadingChatGroupList &&
          chatGroupList &&
          chatGroupList?.data?.data?.length > 0 &&
          chatGroupList?.data?.data?.map((chat) => (
            <ChatItem
              key={chat._id}
              chat={chat}
              onClick={() => {}}
              listUserIsTyping={listUserIsTyping.filter(
                (user) => user.groupId === chat._id
              )}
            />
          ))}
        {isLoadingChatGroupList && (
          <>
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-4 py-3 rounded-lg bg-gray-100 dark:bg-zinc-800 animate-pulse"
                >
                  {/* Avatar skeleton */}
                  <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-zinc-700 mr-4" />
                  {/* Content skeleton */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-32 bg-gray-300 dark:bg-zinc-700 rounded" />
                      <div className="h-3 w-12 bg-gray-200 dark:bg-zinc-600 rounded" />
                    </div>
                    <div className="h-3 w-48 bg-gray-200 dark:bg-zinc-600 rounded mb-1" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-600 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {!isLoadingChatGroupList &&
          chatGroupList &&
          chatGroupList?.data?.data?.length === 0 && (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-medium">
                Không tìm thấy cuộc trò chuyện nào
              </p>
              <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default ListGroupChat;
