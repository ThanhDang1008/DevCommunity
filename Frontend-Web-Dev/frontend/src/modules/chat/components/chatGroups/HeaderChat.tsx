"use client";

import { Search, Phone, Video, MoreVertical, ChevronLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import clsx from "clsx";

import { getChatGroupById } from "@/service/api/chat";
import { queryKeys } from "@/constants/Common";
import { useLayoutChatContext } from "@/modules/chat/components/LayoutChat";
import { socketChatService } from "@/service/socket/chat/socketInstance";
import { ChatEvent } from "@/service/socket/chat/constants/Common";
import MenuGroupChat from "@/modules/chat/components/chatGroups/MenuGroupChat";

const HeaderChat = () => {
  const { groupId, groupIdRef, isConnected, retryConnection, isReConnected } =
    useLayoutChatContext();
  const [countUserOnline, setCountUserOnline] = useState(0);
  const {
    data: chatGroupDetail,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.CHAT_GROUP_DETAIL, groupId],
    queryFn: () => getChatGroupById(groupId),
    gcTime: 1000 * 60 * 30, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  useEffect(() => {
    if (!groupId) return;
    //console.log("listen online count", groupId);
    socketChatService.emit(ChatEvent.CHAT_GROUP_ONLINE_COUNT, {
      groupId: groupId,
    });

    const event = `${ChatEvent.CHAT_GROUP_ONLINE_COUNT}_${groupId}`;

    socketChatService.on(
      event,
      (data: { groupId: string; onlineCount: number }) => {
        //console.log("Online count data:", data);
        if (data.groupId === groupId) {
          setCountUserOnline(Number(data.onlineCount) || 0);
        }
      }
    );

    // Clean up the event listener on unmount
    return () => {
      //socketChatService.off(event);
    };
  }, [groupId]);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  //console.log("chatGroupDetail", chatGroupDetail);
  return (
    <>
      <div className="relative flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-3">
          <Link
            onClick={() => {
              groupIdRef.current = ""; // Reset groupIdRef when navigating back
            }}
            href={`/manage/chat/group`}
            title="Quay lại danh sách nhóm chat"
            className="block md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>

          {chatGroupDetail && (
            <>
              {chatGroupDetail?.data?.data?.avatar ? (
                <img
                  src={chatGroupDetail.data.data.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {chatGroupDetail?.data?.data?.title?.charAt(0) || "G"}
                </div>
              )}
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {chatGroupDetail?.data?.data?.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {countUserOnline} đang hoạt động,{" "}
                  {chatGroupDetail?.data?.data?.participants?.length} thành viên
                </p>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors">
            <Video size={20} />
          </button>
          <button
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <MoreVertical size={20} />
          </button>
        </div>
        {isOpenMenu && (
          <MenuGroupChat
            isOpen={isOpenMenu}
            setIsOpen={setIsOpenMenu}
            groupId={groupId}
          />
        )}
      </div>
      {isConnected === false && !isReConnected && (
        <div className="p-2 text-red-500 text-center bg-red-50 dark:bg-red-900/50">
          Mất kết nối với máy chủ. Vui lòng kiểm tra kết nối hoặc thử lại sau.
          <br />
          <button
            className="mt-1 text-sm py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
    </>
  );
};

export default HeaderChat;
