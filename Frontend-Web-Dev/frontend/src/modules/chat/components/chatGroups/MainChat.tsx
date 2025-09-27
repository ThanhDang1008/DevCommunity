"use client";

import React, { useState, useRef, useEffect, createContext, use } from "react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { getChatGroupById } from "@/service/api/chat";
import { queryKeys } from "@/constants/Common";

import InputChat from "./InputChat";
import HeaderChat from "./HeaderChat";
import MessagesChat from "./MessagesChat";
import type { IGroupMessages } from "@/service/api/chat/types/GroupMessages";
import type { IParticipants } from "@/service/api/chat/types/GroupConversations";

import { useGetInfoUser } from "@/modules/user/hooks";

type TypeMainChatContext = {
  isSendPending: boolean;
  setIsSendStatus: (status: boolean) => void;
  content: string;
  setContent: (content: string) => void;
  replyMessage: IGroupMessages | null; // author
  setReplyMessage: (reply: IGroupMessages | null) => void;
  showScrollToBottom: boolean;
  setShowScrollToBottom: (show: boolean) => void;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  infoUserInGroup: IParticipants | null;
  setInfoUserInGroup: (info: IParticipants | null) => void;
};

const MainChatContext = createContext<TypeMainChatContext>({
  isSendPending: false,
  setIsSendStatus: () => {},
  content: "",
  setContent: () => {},
  replyMessage: null,
  setReplyMessage: () => {},
  showScrollToBottom: false,
  setShowScrollToBottom: () => {},
  messagesContainerRef: { current: null },
  infoUserInGroup: null,
  setInfoUserInGroup: () => {},
});

type TypeMainChatProps = {
  groupId: string;
};

const MainChat = (props: TypeMainChatProps) => {
  const { data: userInfo } = useGetInfoUser();
  const [isSendPending, setIsSendStatus] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [replyMessage, setReplyMessage] = useState<IGroupMessages | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [infoUserInGroup, setInfoUserInGroup] = useState<IParticipants | null>(
    null
  );
  //console.log("replyMessage", replyMessage);

  const {
    data: chatGroupDetail,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.CHAT_GROUP_DETAIL, props.groupId],
    queryFn: () => getChatGroupById(props.groupId),
    gcTime: 1000 * 60 * 30, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  //lấy thông tin người dùng trong nhóm
  const infoParticipant = chatGroupDetail?.data?.data?.participants?.find(
    (user) => user?.userId?._id === userInfo?._id
  );
  useEffect(() => {
    if (infoParticipant) {
      setInfoUserInGroup(infoParticipant);
    } else {
      setInfoUserInGroup(null);
    }
  }, [chatGroupDetail, setInfoUserInGroup, infoParticipant]);

  return (
    <>
      <MainChatContext.Provider
        value={{
          messagesContainerRef,
          showScrollToBottom,
          setShowScrollToBottom,
          isSendPending,
          setIsSendStatus,
          content,
          setContent,
          replyMessage,
          setReplyMessage,
          infoUserInGroup,
          setInfoUserInGroup: setInfoUserInGroup || (() => {}),
        }}
      >
        {/* <div
         className="mt-12 h-screen flex flex-col bg-red-600"> */}
        {/* Chat Container */}
        <div className="flex flex-col flex-1 h-screen">
          {/* Header */}
          <HeaderChat />

          {/* Messages */}
          <MessagesChat />

          {/* Input */}
          <InputChat />
        </div>

        {/* Sidebar - Member List */}
        {/* <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Thành viên nhóm
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {users.length} thành viên
          </p>
        </div>
        <div className="overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-lg">
                  {user.avatar}
                </div>
                <div
                  className={clsx(
                    "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800",
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {getStatusText(user)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
        {/* </div> */}
      </MainChatContext.Provider>
    </>
  );
};

export const useMainChatContext = () => {
  const context = React.useContext(MainChatContext);
  if (!context) {
    throw new Error(
      "useMainChatContext must be used within a MainChatProvider"
    );
  }
  return context;
};

export default MainChat;
