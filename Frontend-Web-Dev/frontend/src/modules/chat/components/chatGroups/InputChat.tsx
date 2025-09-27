"use client";

import { Paperclip, Smile, Mic, Send } from "lucide-react";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
  Ref,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message as messageAntd } from "antd";
import clsx from "clsx";
import { ChevronsDown } from "lucide-react";

import type {
  CreateGroupMessage,
  IGroupMessages,
} from "@/service/api/chat/types/GroupMessages";
import type { AxiosResponse } from "@/lib/axiosInstance";
import type { GetGroupMessagesResponse } from "@/service/api/chat/types/GroupMessages";
import type { InfiniteData } from "@tanstack/react-query";

import { socketChatService } from "@/service/socket/chat/socketInstance";
import { createMessageGroup } from "@/service/api/chat";
import { ChatEvent } from "@/service/socket/chat/constants/Common";
import { useGetInfoUser } from "@/modules/user/hooks";
import { useLayoutChatContext } from "@/modules/chat/components/LayoutChat";
import { useMainChatContext } from "@/modules/chat/components/chatGroups/MainChat";
import ModalUploadStream from "@/modules/file/ModalUploadStream";
import { queryKeys } from "@/constants/Common";

type InputChatProps = {};

type InputChatRef = {};

type TypeListUserIsTyping = {
  groupId: string;
  userId: string;
  fullname: string;
  isTyping: boolean;
};

type ListFileUploadType = {
  listFileUpload: {
    originalname: string; // Tên gốc của file
    key: string;
    mimetype: string;
    url: string;
    size: number; // Kích thước file (nếu có)
  }[];
  setListFileUpload: React.Dispatch<
    React.SetStateAction<
      {
        originalname: string; // Tên gốc của file
        key: string;
        mimetype: string;
        url: string;
        size: number; // Kích thước file (nếu có)
      }[]
    >
  >;
};

const ReplyMessage = () => {
  const { replyMessage, setReplyMessage } = useMainChatContext();
  const { data: userInfo } = useGetInfoUser();
  return (
    <>
      {replyMessage && replyMessage?._id && (
        <div
          className={clsx(
            "p-3 sm:p-4 border-b",
            "bg-gray-50 dark:bg-zinc-900/50",
            "border-gray-200 dark:border-gray-700",
            "flex items-center gap-3",
            "shadow-2xl shadow-blue-500 dark:shadow-blue-500" // Đổ bóng màu xanh đẹp
          )}
        >
          <img
            src={replyMessage.senderId?.avatar || "/default-avatar.png"}
            alt={replyMessage.senderId?.fullname || "User"}
            className={clsx(
              "w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border",
              "border-gray-200 dark:border-gray-700"
            )}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {replyMessage?.senderId?._id === userInfo?._id
                  ? "Bạn"
                  : replyMessage?.senderId?.fullname || "(Người dùng)"}
              </span>
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                Trả lời
              </span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {replyMessage.content?.text}
              {!replyMessage.content?.text &&
                replyMessage.content?.media?.fileId &&
                replyMessage.content?.media?.fileId?.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    (Đính kèm tập tin)
                  </span>
                )}
            </div>
          </div>
          <button
            className={clsx(
              "ml-2 p-1 rounded-full",
              "hover:bg-gray-200 dark:hover:bg-zinc-700",
              "transition-colors"
            )}
            title="Huỷ trả lời"
            onClick={() => {
              setReplyMessage(null);
            }}
          >
            <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
              &times;
            </span>
          </button>
        </div>
      )}
    </>
  );
};

const ListUserTyping = () => {
  const { groupId } = useLayoutChatContext();
  const [listUserIsTyping, setListUserIsTyping] = useState<
    TypeListUserIsTyping[]
  >([]);
  useEffect(() => {
    // Listen to typing event
    if (!groupId) return;

    const event = `${ChatEvent.CHAT_GROUP_TYPING}_${groupId}`;
    socketChatService.on(
      event,
      (data: {
        groupId: string;
        userId: string;
        fullname: string;
        isTyping: boolean;
      }) => {
        setListUserIsTyping((prev) => {
          // Nếu isTyping là false, loại bỏ user khỏi danh sách
          if (!data.isTyping) {
            return prev.filter((user) => user.userId !== data.userId);
          }
          // Nếu isTyping là true, cập nhật hoặc thêm user vào danh sách
          const filtered = prev.filter((user) => user.userId !== data.userId);
          return [...filtered, data];
        });
      }
    );

    return () => {
      //socketChatService.off(event);
    };
  }, [groupId]);
  return (
    <>
      {listUserIsTyping.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-zinc-900">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span>
              {listUserIsTyping
                .filter((user) => user.isTyping)
                .map((user) => user.fullname)
                .join(", ")}{" "}
              đang nhập...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

const ListFileUpload = (props: ListFileUploadType) => {
  return (
    <>
      {props.listFileUpload.length > 0 && (
        <>
          <div
            className={clsx(
              "p-1 sm:p-2 border-b ",
              "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-gray-700",
              "shadow-2xl shadow-blue-500 dark:shadow-blue-500", // Đổ bóng màu xanh đẹp
              "flex items-center justify-between"
            )}
          >
            <div className="flex w-auto flex-nowrap gap-2 overflow-x-auto">
              {props.listFileUpload.map((file, index) =>
                file.mimetype.startsWith("image/") ? (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-slate-200 dark:bg-zinc-800 p-2 rounded-lg shadow-sm min-w-[100px] max-w-[120px] relative"
                  >
                    <img
                      src={file.url}
                      alt={file.originalname}
                      className={clsx(
                        "w-20 h-20 object-cover rounded mb-1 border border-gray-200 dark:border-gray-700",
                        "cursor-pointer hover:opacity-80 transition-opacity"
                      )}
                    />
                    <span
                      title={file.originalname}
                      className="text-xs text-gray-700 dark:text-gray-300 truncate w-full text-center"
                    >
                      {file.originalname}
                    </span>
                    <button
                      className={clsx(
                        "absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700",
                        "hover:bg-gray-200 dark:hover:bg-zinc-600",
                        "transition-colors text-gray-500 dark:text-gray-400",
                        "shadow"
                      )}
                      title="Xoá file này"
                      onClick={() =>
                        props.setListFileUpload((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      style={{ aspectRatio: "1/1" }}
                    >
                      <span className="text-base font-bold leading-none">
                        &times;
                      </span>
                    </button>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-slate-200 dark:bg-zinc-800 p-2 rounded-lg shadow-sm min-w-[100px] max-w-[120px] relative"
                  >
                    <img
                      src={"/image/file_default.png"}
                      alt={file.originalname}
                      className={clsx(
                        "w-20 h-20 object-cover rounded mb-1 border border-gray-200 dark:border-gray-700",
                        "cursor-pointer hover:opacity-80 transition-opacity",
                        "bg-slate-50"
                      )}
                    />
                    <span
                      title={file.originalname}
                      className="text-xs text-gray-700 dark:text-gray-300 truncate w-full text-center"
                    >
                      {file.originalname}
                    </span>
                    <button
                      className={clsx(
                        "absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700",
                        "hover:bg-gray-200 dark:hover:bg-zinc-600",
                        "transition-colors text-gray-500 dark:text-gray-400",
                        "shadow"
                      )}
                      title="Xoá file này"
                      onClick={() =>
                        props.setListFileUpload((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      style={{ aspectRatio: "1/1" }}
                    >
                      <span className="text-base font-bold leading-none">
                        &times;
                      </span>
                    </button>
                  </div>
                )
              )}
            </div>
            <button
              className={clsx(
                "ml-4 p-2 rounded-full",
                "hover:bg-gray-200 dark:hover:bg-zinc-700",
                "transition-colors text-gray-500 dark:text-gray-400"
              )}
              title="Bỏ"
              onClick={() => props.setListFileUpload([])}
            >
              <span className="text-lg font-bold">&times;</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};

const BtnScrollToBottom = () => {
  const { showScrollToBottom, messagesContainerRef } = useMainChatContext();
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  };
  return (
    <div className="w-full flex justify-center bg-gray-50 dark:bg-zinc-800">
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className={clsx(
            "shadow-lg transition-all",
            "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600",
            "hover:from-blue-600 hover:to-blue-700",
            "text-white dark:text-white",
            "px-4 ",
            "rounded-tl-xl rounded-tr-xl",
            "animate-pulse" // Thêm hiệu ứng nhấp nháy
          )}
          aria-label="Cuộn xuống dưới"
        >
          <ChevronsDown size={15} />
        </button>
      )}
    </div>
  );
};

const InputChat = (props: InputChatProps, ref: Ref<InputChatRef>) => {
  const queryClient = useQueryClient();
  const { setContent, replyMessage, setReplyMessage, infoUserInGroup } =
    useMainChatContext();
  const { groupId, isConnected } = useLayoutChatContext();
  const [message, setMessage] = useState("");
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const { data: userInfo } = useGetInfoUser();
  const [isOpenModalUploadStream, setIsOpenModalUploadStream] =
    useState<boolean>(false);

  useImperativeHandle(ref, () => ({}));

  const [listFileUpload, setListFileUpload] = useState<
    {
      originalname: string;
      key: string;
      mimetype: string;
      url: string;
      size: number;
    }[]
  >([
    // {
    //   originalname: "Screenshot 2023-09-09 213420.png",
    //   key: "Screenshot 2023-09-09 213420-1749555480569.png",
    //   mimetype: "image/png",
    //   url: "https://file.minwandev.io.vn/file/Screenshot 2023-09-09 213420-1749555480569.png",
    //   size: 123456, // Kích thước file (ví dụ)
    // },
    // {
    //   originalname: "LOGIC.pdf",
    //   key: "LOGIC-1749575551316.pdf",
    //   mimetype: "application/pdf",
    //   url: "https://file.minwandev.io.vn/file/LOGIC-1749575551316.pdf",
    //   size: 789012, // Kích thước file (ví dụ)
    // },
    // {
    //   fileName: "Screenshot 2023-10-08 143841.png",
    //   key: "Screenshot 2023-10-08 143841-1749555868057.png",
    //   mimetype: "image/png",
    //   url: "https://file.minwandev.io.vn/file/Screenshot 2023-10-08 143841-1749555868057.png",
    // },
    // {
    //   fileName: "Screenshot 2023-09-09 213420.png",
    //   key: "Screenshot 2023-09-09 213420-1749555879474.png",
    //   mimetype: "image/png",
    //   url: "https://file.minwandev.io.vn/file/Screenshot 2023-09-09 213420-1749555879474.png",
    // },
    // {
    //   fileName: "merged.pdf.png",
    //   key: "merged-1749575522547.png",
    //   mimetype: "image/png",
    //   url: "https://file.minwandev.io.vn/file/merged-1749575522547.png",
    // },
    // {
    //   fileName: "Screenshot 2023-08-27 205209.png",
    //   key: "Screenshot 2023-08-27 205209-1749555903683.png",
    //   mimetype: "image/png",
    //   url: "https://file.minwandev.io.vn/file/Screenshot 2023-08-27 205209-1749555903683.png",
    // },
    // {
    //   fileName: "Screenshot 2023-09-09 213420.png",
    //   key: "Screenshot 2023-09-09 213420-1749555934191.png",
    //   mimetype: "image/png",
    //   url: "https://file.minwandev.io.vn/file/Screenshot 2023-09-09 213420-1749555934191.png",
    // },
  ]);
  //console.log("listFileUpload", listFileUpload);

  // Emit typing event with debounce and turn off isTyping after 500ms of inactivity
  useEffect(() => {
    if (!groupId || !userInfo) return;

    const typingEvent = `${ChatEvent.CHAT_GROUP_TYPING}`;
    const stopTypingEvent = `${ChatEvent.CHAT_GROUP_TYPING}`;

    let typingTimeout: NodeJS.Timeout;
    let stopTypingTimeout: NodeJS.Timeout;

    // Emit typing event after 200ms
    typingTimeout = setTimeout(() => {
      socketChatService.emit(typingEvent, {
        groupId: groupId,
        userId: userInfo._id,
        fullname: userInfo.fullname,
        isTyping: message.trim().length > 0 ? true : false,
      });
    }, 200);

    // Emit stop typing event after 500ms of inactivity
    if (message.trim().length > 0) {
      stopTypingTimeout = setTimeout(() => {
        socketChatService.emit(stopTypingEvent, {
          groupId: groupId,
          userId: userInfo._id,
          fullname: userInfo.fullname,
          isTyping: false,
        });
      }, 1000);
    }

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(stopTypingTimeout);
      // socketChatService.off(typingEvent);
    };
  }, [groupId, message, userInfo]);

  const { mutate: createMessageGroupMutation, isPending } = useMutation({
    mutationFn: (data: CreateGroupMessage) => createMessageGroup(data),
    onSuccess: (data) => {
      // messageAntd.open({
      //   type: "success",
      //   content: "Gửi tin nhắn thành công",
      // });
    },
    onError: (error: any) => {
      if (error?.response?.status === 429) {
        messageAntd.open({
          type: "error",
          content: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau",
          duration: 3,
        });
        return;
      }
      messageAntd.open({
        type: "error",
        content:
          error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
      return;
    },
    retry: 1,
    retryDelay: 2000,
  });

  // useEffect(() => {
  //   setIsSendStatus(isPending);
  // }, [isPending]);

  const handleSendMessage = () => {
    if (!isConnected) {
      //messageAntd.error("Mất kết nối, vui lòng thử lại sau");
      alert("Mất kết nối, vui lòng thử lại sau");
      return;
    }
    console.log("permissions", infoUserInGroup?.permissions);

    if (!infoUserInGroup?.permissions?.can_send_messages) {
      messageAntd.error("Bạn không có quyền gửi tin nhắn trong nhóm này");
      return;
    }

    const messageValue = messageRef.current?.value ?? "";
    // Nếu không có file upload thì phải có nội dung tin nhắn
    if (listFileUpload.length === 0 && messageValue.trim().length === 0) {
      // messageAntd.error(
      //   "Vui lòng nhập tin nhắn không quá 2000 ký tự hoặc chọn file đính kèm"
      // );
      alert("Vui lòng nhập tin nhắn");
      return;
    }
    if (messageValue.length > 2000) {
      // messageAntd.error("Tin nhắn không được quá 2000 ký tự");
      alert("Tin nhắn không được quá 2000 ký tự");
      return;
    }
    setContent(messageValue);

    const UUID = `msg_group_${crypto.randomUUID()}`;

    createMessageGroupMutation({
      UUID: UUID,
      groupId: groupId,
      content: {
        text: messageValue,
        media: {
          fileId:
            listFileUpload.length > 0
              ? listFileUpload.map((file) => file.key as any)
              : [],
        },
      },
      type: ["text"], // Assuming type is always text for simplicity
      replyToId: replyMessage?._id || null, // If replying to a message
    });
    queryClient.setQueryData(
      [queryKeys.GET_ALL_MESSAGES_GROUP, groupId],
      (oldData: InfiniteData<AxiosResponse<GetGroupMessagesResponse>>) => {
        if (!oldData) return oldData;
        // Lấy trang đầu tiên (mới nhất)
        const firstPageIndex = 0;
        const firstPage = oldData.pages[firstPageIndex];

        // Thêm message mới vào trang đầu tiên
        const updatedPages = oldData.pages.map((page, idx) => {
          if (idx === firstPageIndex) {
            return {
              ...page,
              data: {
                ...page.data,
                //thêm message mới vào (đầu) danh sách
                data: [
                  {
                    _id: UUID, // Sử dụng UUID đã tạo
                    UUID: UUID,
                    groupConversationId: groupId, // Tham chiếu đến cuộc trò chuyện nhóm (groupConversationId)
                    senderId: {
                      _id: userInfo?._id,
                      fullname: userInfo?.fullname,
                      avatar: userInfo?.avatar,
                      email: userInfo?.email,
                    },
                    type: ["text"], // Loại tin nhắn, có thể là "text", "media", "location", "sticker"
                    // Nội dung tin nhắn
                    content: {
                      text: messageValue, // Nội dung tin nhắn,
                      mentions: [], // Danh sách người dùng được đề cập trong tin nhắn
                      media: {
                        fileId: listFileUpload.length > 0 ? listFileUpload : [], // Danh sách ID tập tin đính kèm, nếu có
                      },
                      sticker: null, // Thông tin về sticker, nếu có
                    },
                    // Thông tin về tin nhắn trả lời
                    replyToId: replyMessage ? replyMessage : null, // Tham chiếu đến tin nhắn được trả lời, nếu có
                    isDeleted: false, // Trạng thái đã xóa
                    isEdited: false, // Trạng thái đã chỉnh sửa
                    isPinned: false, // Trạng thái đã ghim
                    editedAt: null, // Ngày chỉnh sửa tin nhắn, null nếu không có
                    // Ngày tạo tin nhắn 2025-07-07T07:13:26.818Z
                    createdAt: new Date().toISOString(), // Ngày tạo tin nhắn
                    pinnedAt: null, // Ngày ghim tin nhắn, null nếu không có

                    pinnedBy: null,

                    readBy: [], // Danh sách người dùng đã đọc tin nhắn
                    // Reactions (like Telegram)
                    reactions: [], // Danh sách các phản ứng của người dùng với tin nhắn,
                    isSent: false, // Trạng thái đã gửi tin nhắn
                  },
                  ...(page.data.data || []),
                ],
              },
            };
          }
          return page;
        });
        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );
    setReplyMessage(null);
    messageRef.current!.value = ""; // Clear the textarea after sending
    setListFileUpload([]); // Clear file uploads after sending
    if (messageRef.current) {
      messageRef.current.style.height = "40px"; // Reset height after sending
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // const handleResizeTextarea = () => {
  //   if (messageRef.current) {
  //     const textarea = messageRef.current;
  //     textarea.style.height = "auto";
  //     textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  //   }
  // };

  // useEffect(() => {
  //   handleResizeTextarea();
  // }, [messageRef.current, message]);

  return (
    <>
      <BtnScrollToBottom />
      <ListUserTyping />
      <ListFileUpload
        listFileUpload={listFileUpload}
        setListFileUpload={setListFileUpload}
      />
      <ReplyMessage />
      <div className="p-4 bg-white dark:bg-zinc-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <button
            onClick={() => {
              if (!infoUserInGroup?.permissions?.can_send_media) {
                messageAntd.error(
                  "Bạn không có quyền tải lên tập tin trong nhóm này"
                );
                return;
              }
              setIsOpenModalUploadStream(true);
            }}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <Paperclip size={20} />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={messageRef}
              spellCheck="false"
              maxLength={2000}
              onChange={(e) => {
                if (messageRef.current) {
                  const textarea = messageRef.current;
                  textarea.style.height = "auto";
                  textarea.style.height = `${Math.min(
                    textarea.scrollHeight,
                    120
                  )}px`;
                }
                //setMessage sau 400ms để tránh việc gửi tin nhắn quá nhanh
                setTimeout(() => {
                  setMessage(e.target.value);
                }, 400);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors overflow-hidden"
              rows={1}
              style={{ minHeight: "40px", maxHeight: "120px", height: "40px" }}
            />
          </div>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors">
            <Smile size={20} />
          </button>
          {messageRef.current?.value.trim() || listFileUpload.length > 0 ? (
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <Send size={20} />
            </button>
          ) : (
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors">
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>

      <ModalUploadStream
        isOpen={isOpenModalUploadStream}
        title={"Tải lên tập tin"}
        onOk={() => setIsOpenModalUploadStream(false)}
        onCancel={() => setIsOpenModalUploadStream(false)}
        onUploadSuccess={(data) => {
          setListFileUpload((prev) => [
            ...prev,
            {
              originalname: data?.fileName,
              key: data?.key,
              mimetype: data?.mimetype,
              url: data?.url,
              size: data?.size, // Kích thước tập tin
            },
          ]);
        }}
      />
    </>
  );
};

export default forwardRef(InputChat);
