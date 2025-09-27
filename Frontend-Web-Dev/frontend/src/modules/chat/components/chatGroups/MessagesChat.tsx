"use client";

import { useState, useRef, useEffect, useMemo, Fragment } from "react";
import { Reply, Ellipsis, EyeIcon, ChevronsDown } from "lucide-react";
import clsx from "clsx";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";
import type { InfiniteData } from "@tanstack/react-query";
import { File, MessageCircle } from "lucide-react";
import { Image as ImageAntd, message as messageAntd } from "antd";

import type { AxiosResponse } from "@/lib/axiosInstance";
import type { GetGroupMessagesResponse } from "@/service/api/chat/types/GroupMessages";
import type { IGroupMessages } from "@/service/api/chat/types/GroupMessages";
import type { GetListGroupConversationsResponse } from "@/service/api/chat/types/GroupConversations";

import useInfiniteScroll from "@/hooks/useInfiniteScroll";

import { convertByte } from "@/shared/utils/convertByte";
import {
  getAllMessagesGroup,
  readMessagesByUser,
  deleteMessageGroup,
} from "@/service/api/chat";
import { useGetInfoUser } from "@/modules/user/hooks";
import { ChatEvent } from "@/service/socket/chat/constants/Common";
import { socketChatService } from "@/service/socket/chat/socketInstance";
import { useLayoutChatContext } from "@/modules/chat/components/LayoutChat";
import { useMainChatContext } from "@/modules/chat/components/chatGroups/MainChat";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatTimeMessage } from "@/shared/utils/time";
import { VideoPlayer } from "@/components/ui/video/video-player";
import { formatTimeMessageChat } from "@/shared/utils/time";

type MessagesChatProps = {};

type MessagesItemProps = {
  msg: IGroupMessages;
  messages: IGroupMessages[];
  isOwnMessage: boolean;
  openMenuId: string | number | null;
  setOpenMenuId: (id: string | number | null) => void;
  clickedMessageId: string | null;
  index: number;
};

type MessagesItemMediaProps = {
  msg: IGroupMessages;
  isOwnMessage: boolean;
};

type MessagesItemMenuProps = {
  isOwnMessage: boolean;
  groupId: string;
  messageId: string;
  msg: IGroupMessages;
};

const MessagesItemMedia = (props: MessagesItemMediaProps) => {
  return (
    <>
      {props.msg?.content?.media?.fileId &&
        props.msg?.content?.media?.fileId.length > 0 &&
        (() => {
          const files = props.msg.content.media.fileId;
          const imageFiles = files.filter((file) =>
            file.mimetype?.startsWith("image/")
          );
          const videoFiles = files.filter((file) =>
            file.mimetype?.startsWith("video/")
          );
          const nonMediaFiles = files.filter(
            (file) =>
              !file.mimetype?.startsWith("image/") &&
              !file.mimetype?.startsWith("video/")
          );
          // Tính số cột phù hợp: tối đa 3, tối thiểu 1
          const imageCount = imageFiles.length;
          const columns =
            imageCount === 1
              ? 1
              : imageCount === 2
              ? 2
              : imageCount >= 3
              ? 3
              : 1;
          // Xác định căn lề dựa trên isOwnMessage
          const alignClass = props.isOwnMessage ? "ml-auto" : "mr-auto";
          return (
            <>
              <div className="mb-1 mt-3">
                {imageFiles.length > 0 && (
                  <div
                    className={`grid gap-1 max-w-xs sm:max-w-sm md:max-w-md w-full ${alignClass}`}
                    style={{
                      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    }}
                  >
                    {imageFiles.map((file, index) => (
                      // <a
                      //   key={index}
                      //   href={file.url}
                      //   target="_blank"
                      //   rel="noopener noreferrer"
                      //   className="block"
                      // >
                      // </a>
                      <div
                        key={index}
                        className="w-full aspect-square bg-gray-100 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center"
                      >
                        {props.msg.isDeleted ? (
                          <div className="flex items-center justify-center w-72 md:w-96 h-full text-gray-400 text-xs select-none">
                            (Ảnh đã bị thu hồi)
                          </div>
                        ) : (
                          <ImageAntd
                            src={file.url}
                            alt={file.originalname || `Ảnh ${index + 1}`}
                            className="w-full h-full object-contain"
                            preview={{
                              mask: (
                                <div className="flex items-center justify-center w-full h-full bg-gray-200/10 dark:bg-zinc-700/20">
                                  <MessageCircle className="text-gray-500 dark:text-gray-400" />
                                </div>
                              ),
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {videoFiles.length > 0 && (
                  <div
                    className={`flex flex-col gap-2 mt-1 w-72 md:w-96 max-w-full ${alignClass}`}
                  >
                    {videoFiles.map((file, index) => (
                      <div key={index}>
                        {props.msg.isDeleted ? (
                          <div className="flex items-center justify-center w-full h-[250px] bg-gray-100 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 text-xs select-none">
                            (Video đã bị thu hồi)
                          </div>
                        ) : (
                          <VideoPlayer
                            src={file.url}
                            style={{
                              height: "250px",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {nonMediaFiles.length > 0 && (
                  <div
                    className={`flex flex-col gap-2 mt-1 w-72 max-w-full ${alignClass}`}
                  >
                    {nonMediaFiles.map((file, index) => (
                      <div
                        key={index}
                        className={clsx(
                          "flex items-center justify-between rounded-lg border px-3 py-2",
                          "bg-gray-100 dark:bg-zinc-700 border-gray-200 dark:border-gray-700",
                          "hover:bg-gray-200 dark:hover:bg-zinc-600 transition cursor-pointer"
                        )}
                      >
                        {props.msg.isDeleted ? (
                          <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs select-none">
                            (Tệp đính kèm đã bị thu hồi)
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <File
                                className="text-gray-500 dark:text-gray-400"
                                size={20}
                              />
                              <div className="flex flex-col gap-1">
                                <span className="truncate text-sm text-gray-800 dark:text-gray-100 max-w-[150px]">
                                  {file.originalname ||
                                    `Tệp đính kèm ${index + 1}`}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {convertByte(file.size)} | {file.mimetype}
                                </span>
                              </div>
                            </div>
                            <a
                              href={file.url}
                              download={file.originalname}
                              className="ml-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition"
                              title="Tải về"
                            >
                              Tải về
                            </a>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          );
        })()}
    </>
  );
};

const MessagesItem = (props: MessagesItemProps) => {
  const { groupId } = useLayoutChatContext();
  const { data: userInfo } = useGetInfoUser();
  useEffect(() => {
    if (!props?.msg?._id || !groupId) return;
    // Gửi yêu cầu đánh dấu tin nhắn là đã đọc
    // Chỉ đánh dấu là đã đọc nếu _id không bắt đầu bằng "msg_group_"

    if (
      !props?.msg?._id?.startsWith("msg_group_") &&
      userInfo &&
      userInfo?._id !== props?.msg?.senderId?._id && // tránh đánh dấu là đã đọc nếu người dùng là người gửi tin nhắn
      // Chỉ gọi nếu userId chưa có trong readBy
      !props?.msg?.readBy?.some((user) => user?._id === userInfo?._id)
    ) {
      // console.log("userInfo", userInfo);
      // console.log("props?.msg?.senderId?._id", props?.msg?.senderId?._id);
      // console.log("props?.index", props.index);

      readMessagesByUser({
        groupId: groupId,
        messageId: props?.msg?._id,
      });
    }
  }, [props?.msg?._id, groupId]);

  return (
    <>
      <div className="flex items-end flex-col space-y-1">
        <div
          className={clsx(
            "max-w-60 sm:max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-xl",

            props.isOwnMessage
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white rounded-bl-md",
            {
              hidden: !props.msg.content.text,
            }
          )}
        >
          {/* Hiển thị tin nhắn trả lời nếu có */}
          {props.msg.replyToId && (
            <div
              className={clsx(
                "mb-2 p-2 rounded bg-blue-100 dark:bg-zinc-800 border-l-4 text-xs text-gray-700 dark:text-gray-200",

                "flex flex-col space-y-1",
                {
                  "border-blue-300": props.isOwnMessage,
                  "border-blue-500": !props.isOwnMessage,
                  "dark:border-blue-500": !props.isOwnMessage,
                  "dark:border-blue-200": props.isOwnMessage,
                }
              )}
            >
              <span className="font-semibold">
                {props.msg?.replyToId?.senderId?.fullname || "Ẩn danh"}
              </span>{" "}
              <span>
                <a
                  href={`#message-${props.msg?.replyToId?._id}`}
                  //id={`message-${props.msg?.replyToId?._id}`}
                  rel="noopener noreferrer" //để tránh lỗ hổng bảo mật
                  className={clsx("dark:text-gray-200", {
                    "text-gray-900": props.isOwnMessage,
                    "text-gray-900 ": !props.isOwnMessage,
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    // Scroll to the replied message
                    const repliedMessageElement = document.getElementById(
                      `message-${props.msg?.replyToId?._id}`
                    );
                    if (repliedMessageElement) {
                      repliedMessageElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                >
                  {props.msg?.replyToId?.content?.text}
                  {!props.msg?.replyToId?.content?.text &&
                    props.msg?.replyToId?.content?.media?.fileId &&
                    props.msg?.replyToId?.content?.media?.fileId.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (Tệp đính kèm)
                      </span>
                    )}
                </a>
              </span>
            </div>
          )}

          {!props.isOwnMessage && (
            <div className="text-xs font-medium text-blue-500 dark:text-blue-400 mb-1">
              {props?.msg?.senderId?.fullname}
            </div>
          )}

          <div className="text-sm leading-relaxed break-words whitespace-pre-line">
            {!props.msg.isDeleted && (
              <a
                //href={`#message-${props.msg._id}`}
                id={`message-${props.msg._id}`}
                rel="noopener noreferrer" //để tránh lỗ hổng bảo mật
                className={clsx("dark:text-gray-200", {
                  "text-white": props.isOwnMessage,
                  "text-gray-900 ": !props.isOwnMessage,
                })}
              >
                {props.msg.content.text || ""}
              </a>
            )}
            {props.msg.isDeleted && (
              <a
                //href={`#message-${props.msg._id}`}
                id={`message-${props.msg._id}`}
                rel="noopener noreferrer" //để tránh lỗ hổng bảo mật
                className={clsx("dark:text-gray-200 blur-md", {
                  "text-white": props.isOwnMessage,
                  "text-gray-900 ": !props.isOwnMessage,
                })}
              >
                (Tin nhắn đã bị thu hồi)
              </a>
            )}
          </div>

          <div
            className={clsx(
              "text-xs mt-1 opacity-70",
              props.isOwnMessage
                ? "text-blue-100"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {formatTimeMessage(new Date(props.msg.createdAt))}
            {props.msg.isDeleted && (
              <span
                className={clsx("ml-1 italic", {
                  "text-red-500": !props.isOwnMessage,
                  "text-blue-200": props.isOwnMessage,
                })}
              >
                (Đã thu hồi)
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-1 items-center">
          {props.isOwnMessage && props.messages[0]?._id === props.msg._id && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {props?.msg?.isSent === true && "Đã gửi"}
              {props?.msg?.isSent === false && "Đang gửi..."}
            </p>
          )}
          {props.isOwnMessage &&
            // props?.msg?.readBy?.length > 0 &&
            props.clickedMessageId === props.msg._id && ( // Kiểm tra nếu tin nhắn đã được click
              <div className="relative">
                <div className="flex space-x-1 items-center">
                  {props.isOwnMessage &&
                    props.messages[0]?._id !== props.msg._id && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {props?.msg?.isSent === true && "Đã gửi"}
                        {props?.msg?.isSent === false && "Đang gửi..."}
                      </p>
                    )}
                  <button
                    className={clsx(
                      "mt-1 text-xs text-blue-400 hover:underline focus:outline-none",
                      {
                        "flex justify-center items-center gap-1":
                          props?.msg?.readBy?.length > 0,
                      }
                    )}
                    title="Xem danh sách đã xem"
                    onClick={() =>
                      props.setOpenMenuId(
                        props.openMenuId === `seen_${props.msg._id}`
                          ? null
                          : `seen_${props.msg._id}`
                      )
                    }
                  >
                    {props?.msg?.readBy?.length}{" "}
                    <EyeIcon className="inline-block" size={12} />
                  </button>
                  {/*menu danh sách người đã xem tin nhắn */}
                  {props.openMenuId === `seen_${props.msg._id}` && (
                    <div className="absolute -translate-x-2/3 bottom-full mb-2 bg-white dark:bg-zinc-800 rounded shadow-lg border dark:border-gray-700 min-w-[120px] z-50 p-2">
                      <div className="text-xs text-gray-700 dark:text-gray-200 font-semibold mb-1">
                        Đã xem:
                      </div>
                      <ul className="space-y-1">
                        {props?.msg?.readBy.map((user) => (
                          <li
                            key={user._id}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-6 h-6 bg-gray-300 dark:bg-zinc-600 rounded-full flex items-center justify-center text-sm">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.fullname || "Avatar"}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                "👤"
                              )}
                            </div>
                            <span className="text-xs text-gray-800 dark:text-gray-200">
                              {user.fullname}
                            </span>
                          </li>
                        ))}
                        {props?.msg?.readBy.length === 0 && (
                          <li className="text-xs text-gray-500 dark:text-gray-400">
                            Chưa có ai xem
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

const MessagesItemMenu = (props: MessagesItemMenuProps) => {
  const { infoUserInGroup } = useMainChatContext();
  const {
    mutate: deleteMessageGroupMutation,
    isPending: isPendingDeleteMessageGroup,
  } = useMutation({
    mutationFn: (data: {
      groupId: string;
      messageId: string;
      isDeleted: boolean;
    }) => deleteMessageGroup(data),
    onSuccess: (data) => {},
    onError: (error: any) => {
      messageAntd.open({
        type: "error",
        content:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
    },
    retry: 0,
    retryDelay: 2000,
  });

  const handleDeleteMessage = () => {
    if (!props.groupId || !props.messageId) return;
    deleteMessageGroupMutation({
      groupId: props.groupId,
      messageId: props.messageId,
      isDeleted: true, // Đánh dấu là đã thu hồi
    });
  };

  //hoàn tác thu hồi tin nhắn
  const handleUndoDeleteMessage = () => {
    if (!props.groupId || !props.messageId) return;
    deleteMessageGroupMutation({
      groupId: props.groupId,
      messageId: props.messageId,
      isDeleted: false, // Hoàn tác thu hồi
    });
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        messageAntd.success("Đã sao chép tin nhắn vào clipboard");
      })
      .catch((error) => {
        messageAntd.error("Không thể sao chép tin nhắn");
      });
  };
  return (
    <>
      <div
        className={clsx(
          "absolute bottom-full mb-2 w-40  rounded-md shadow-lg z-50 border ",
          "bg-white dark:bg-zinc-800 dark:border-zinc-700",
          {
            "right-0": props.isOwnMessage,
            "left-0": !props.isOwnMessage,
          }
        )}
      >
        {props.isOwnMessage && (
          <button className="w-full px-4 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-white">
            Sửa tin nhắn
          </button>
        )}
        {props.isOwnMessage && (
          <button
            onClick={() => {
              if (!infoUserInGroup?.permissions?.can_delete_messages) {
                messageAntd.error(
                  "Bạn không có quyền thu hồi tin nhắn trong nhóm này"
                );
                return;
              }
              return props.msg?.isDeleted
                ? handleUndoDeleteMessage()
                : handleDeleteMessage();
            }}
            className="w-full px-4 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-white"
          >
            {props.msg?.isDeleted ? "Hoàn tác thu hồi" : "Thu hồi"}
          </button>
        )}
        {!props.msg?.isDeleted && (
          <button
            onClick={() => handleCopyMessage(props?.msg?.content?.text || "")}
            className="w-full px-4 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-white"
          >
            Sao chép
          </button>
        )}
      </div>
    </>
  );
};

const MessagesChat = (props: MessagesChatProps) => {
  const { groupId } = useLayoutChatContext();
  const { setReplyMessage, setShowScrollToBottom, messagesContainerRef } =
    useMainChatContext();
  const { data: userInfo } = useGetInfoUser();
  const queryClient = useQueryClient();
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [clickedMessageId, setClickedMessageId] = useState<string | null>(null);

  // console.log("userInfo", userInfo);

  //socketChatService
  useEffect(() => {
    //--------- only listen to the specific group chat event
    const event_CHAT_GROUP_MESSAGE = `${ChatEvent.CHAT_GROUP_MESSAGE}_${groupId}`;
    // console.log("Listening to event:", event_CHAT_GROUP_MESSAGE);
    socketChatService.on(
      event_CHAT_GROUP_MESSAGE,
      (data: { groupId: string; message: IGroupMessages }) => {
        //console.log("Received message:", data);
        if (groupId === data.groupId) {
          queryClient.setQueryData(
            [queryKeys.GET_ALL_MESSAGES_GROUP, groupId],
            (
              oldData: InfiniteData<AxiosResponse<GetGroupMessagesResponse>>
            ) => {
              if (!oldData) return oldData;
              // Lấy trang đầu tiên (mới nhất)
              const firstPageIndex = 0;
              const firstPage = oldData.pages[firstPageIndex];
              // Nếu đã có messageId này thì không cập nhật
              // if (
              //   firstPage?.data?.data?.some(
              //     (msg: IGroupMessages) => msg?._id === data?.message?._id
              //   )
              // ) {
              //   return oldData;
              // }
              // Thêm message mới vào trang đầu tiên
              const updatedPages = oldData.pages.map((page, idx) => {
                if (idx === firstPageIndex) {
                  // nếu tin nhắn của người khác (không phải của chính mình)
                  // thì thêm vào đầu mảng
                  // Nếu đã có messageId này thì không thêm nữa
                  if (
                    userInfo &&
                    userInfo?._id !== data?.message?.senderId?._id
                  ) {
                    // Kiểm tra nếu messageId đã tồn tại trong trang này thì không thêm nữa(quan trọng)
                    const exists = page?.data?.data?.some(
                      (msg) => msg?._id === data?.message?._id
                    );
                    if (!exists) {
                      return {
                        ...page,
                        data: {
                          ...page.data,
                          data: [data.message, ...(page?.data?.data || [])],
                        },
                      };
                    }
                  }
                  // Nếu là tin nhắn của chính mình (gửi đi), thì ghi đè message có UUID khớp (để cập nhật trạng thái gửi)
                  // nếu là tin nhắn của chính mình, thì cập nhật tin nhắn có UUID khớp
                  return {
                    ...page,
                    data: {
                      ...page.data,
                      data: page?.data?.data.map((msg) => {
                        if (
                          msg?.UUID === data?.message?.UUID &&
                          msg?.isSent === false
                        ) {
                          return data?.message;
                        }
                        return msg;
                      }),
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
          scrollToBottom();
          return; // Chỉ xử lý nếu groupId khớp
        }
      }
    );

    const event_CHAT_GROUP_READ_MESSAGE = `${ChatEvent.CHAT_GROUP_MESSAGE_READ}_${groupId}`;
    socketChatService.on(
      event_CHAT_GROUP_READ_MESSAGE,
      (data: {
        groupId: string;
        messageId: string;
        userId: string;
        readBy: { _id: string; fullname: string; avatar: string }[];
      }) => {
        //console.log(`${event_CHAT_GROUP_READ_MESSAGE}`, data);
        queryClient.setQueryData(
          [queryKeys.GET_ALL_MESSAGES_GROUP, groupId],
          (oldData: InfiniteData<AxiosResponse<GetGroupMessagesResponse>>) => {
            if (!oldData || !oldData.pages) return oldData;

            const updatedPages = oldData.pages.map((page) => {
              if (!page?.data?.data) return page;
              const updatedMessages = page.data.data.map(
                (msg: IGroupMessages) => {
                  if (msg._id === data.messageId) {
                    // Tránh cập nhật nếu readBy đã có userId này
                    if (msg.readBy.some((user) => user._id === data.userId)) {
                      return msg;
                    }
                    return {
                      ...msg,
                      readBy: data.readBy,
                    };
                  }
                  return msg;
                }
              );
              return {
                ...page,
                data: {
                  ...page.data,
                  data: updatedMessages,
                },
              };
            });

            return {
              ...oldData,
              pages: updatedPages,
            };
          }
        );
      }
    );

    const event_CHAT_GROUP_MESSAGE_DELETED = `${ChatEvent.CHAT_GROUP_MESSAGE_DELETED}_${groupId}`;
    //cập nhật lại isDeleted là true cho tin nhắn đã bị xoá
    socketChatService.on(
      event_CHAT_GROUP_MESSAGE_DELETED,
      (data: {
        groupId: string;
        messageId: string;
        isDeleted: boolean;
        userId: string;
      }) => {
        //console.log(`${event_CHAT_GROUP_MESSAGE_DELETED}`, data);
        queryClient.setQueryData(
          [queryKeys.GET_ALL_MESSAGES_GROUP, groupId],
          (oldData: InfiniteData<AxiosResponse<GetGroupMessagesResponse>>) => {
            if (!oldData || !oldData.pages) return oldData;

            const updatedPages = oldData.pages.map((page) => {
              if (!page?.data?.data) return page;
              const updatedMessages = page.data.data.map(
                (msg: IGroupMessages) => {
                  if (msg._id === data.messageId) {
                    return {
                      ...msg,
                      isDeleted: data.isDeleted,
                    };
                  }
                  return msg;
                }
              );
              return {
                ...page,
                data: {
                  ...page.data,
                  data: updatedMessages,
                },
              };
            });

            return {
              ...oldData,
              pages: updatedPages,
            };
          }
        );

        queryClient.setQueryData(
          [queryKeys.GET_ALL_CHAT_GROUP],
          (oldData: AxiosResponse<GetListGroupConversationsResponse>) => {
            if (!oldData || !oldData.data) return oldData;

            // Cập nhật lại lastMessage cho nhóm chat
            const updatedGroups = oldData.data.data.map((group) => {
              if (group._id === groupId) {
                if (group.lastMessageId?._id === data.messageId) {
                  return {
                    ...group,
                    lastMessageId: {
                      ...group.lastMessageId,
                      isDeleted: data.isDeleted,
                    },
                  };
                }
              }
              return group;
            });

            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: updatedGroups,
              },
            };
          }
        );
      }
    );

    return () => {
      // socketChatService.off(event_CHAT_GROUP_MESSAGE);
      // socketChatService.off(event_CHAT_GROUP_READ_MESSAGE);
    };
  }, [groupId, userInfo, queryClient]);

  const LIMIT = 30; // Số lượng tin nhắn mỗi lần fetch

  const {
    data: messagesGroupData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKeys.GET_ALL_MESSAGES_GROUP, groupId],
    queryFn: ({ pageParam = 1 }: { pageParam?: unknown }) =>
      getAllMessagesGroup(groupId, Number(pageParam), LIMIT),
    getNextPageParam: (response: AxiosResponse<GetGroupMessagesResponse>) => {
      if (response?.data?.currentPage < response?.data?.totalPages) {
        return response?.data?.currentPage + 1;
      }
      return undefined;
    },

    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 1,
    retryDelay: 2000,
    retryOnMount: true, // retry when mount component
    gcTime: 1000 * 60 * 30, //thời gian xoá cache khi không sử dụng
    initialPageParam: 1,
  });

  const { targetRef } = useInfiniteScroll({
    onIntersection: async () => {
      if (!isFetchingNextPage && hasNextPage) {
        //console.log("Fetching next page of messages...");
        fetchNextPage().finally(() => {});
      }
    },
    enabled: !isFetchingNextPage && hasNextPage,
    threshold: 0.1,
    rootMargin: "100px", // khoảng cách giữa root và target
    debounceMs: 0, // thời gian debounce 300ms
    scrollDirection: false, // không cần phân biệt hướng cuộn
  });

  const messages = useMemo(() => {
    return (
      messagesGroupData?.pages.flatMap((page) =>
        page?.data?.data ? page.data.data : []
      ) || []
    );

    // const allMessages =
    //   messagesGroupData?.pages.flatMap((page) => page?.data?.data || []) || [];

    // const sortedMessages = [...allMessages].sort(
    //   (a, b) =>
    //     new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    // );

    // return sortedMessages;
  }, [messagesGroupData]);

  useEffect(() => {
    if (
      messagesGroupData?.pageParams &&
      messagesGroupData.pageParams.length > 0
    ) {
      const lastPage =
        messagesGroupData.pageParams[messagesGroupData.pageParams.length - 1];
      if (lastPage === 1) {
        //chỉ scroll xuống dưới khi lần đầu tiên load dữ liệu
        scrollToBottom();
      }
    }
  }, [messagesGroupData]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      //cuộn xuống dưới cùng của container
      // messagesContainerRef.current.scrollTo({
      //   top: messagesContainerRef.current.scrollHeight,
      //   behavior: "instant", // không có hiệu ứng cuộn
      // });
      //messagesContainerRef.current.scrollTop = 0;
    }
  };

  // useEffect(() => {
  //   //message-68486515793949018d12aa3d
  //   //cuộn đến tin nhắn có id là message-68486515793949018d12aa3d
  //   const messageElement = document.getElementById(
  //     `message-68486515793949018d12aa3d`
  //   );
  //   console.log("messageElement", messageElement);
  //   if (messageElement) {
  //     messageElement.scrollIntoView({
  //       behavior: "smooth",
  //       block: "end", // cuộn đến cuối tin nhắn
  //     });
  //   }
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = messagesContainerRef.current;

      if (!container) return;
      //console.log("container.scrollTop", container.scrollTop);
      // Because flex-col-reverse, scrollTop = 0 is bottom, scrollTop increases as you scroll up
      if (container.scrollTop < -1000) {
        setShowScrollToBottom(true);
      } else {
        setShowScrollToBottom(false);
      }
    };
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [groupId]);

  return (
    <>
      <div
        ref={messagesContainerRef} // Attach ref to the scrollable container
        className={clsx(
          "relative flex h-full overflow-y-auto p-0 sm:p-2 space-y-3 bg-gray-50 dark:bg-zinc-800",
          "flex-col-reverse [scroll-behavior:auto] [overflow-anchor:auto]"
        )}
      >
        {messages &&
          messages.map((msg, index) => {
            const isOwnMessage = msg?.senderId?._id === userInfo?._id;
            // console.log("msg.senderId._id", msg.senderId._id);
            // console.log("userInfo?._id", userInfo?._id);

            // nếu thời gian tin nhắn trước đó cách nhau < 45 phút thì hiển thị thời gian
            const prevMsg = messages[index + 1] || null; // Lấy tin nhắn trước đó (nếu có)
            //console.log("prevMsg",index,msg,prevMsg);

            const showTime =
              !prevMsg ||
              new Date(msg.createdAt).getTime() -
                new Date(prevMsg.createdAt).getTime() >
                45 * 60 * 1000; // 45 phút

            return (
              <Fragment key={msg?._id}>
                <div
                  key={index}
                  className={clsx(
                    "relative group flex w-full items-center px-2",
                    isOwnMessage ? "justify-end" : "justify-start"
                  )}
                  onClick={() => {
                    setClickedMessageId(msg._id);
                    // setOpenMenuId(
                    //   openMenuId === msg._id ? null : msg._id
                    // );
                  }}
                >
                  {!isOwnMessage && (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-zinc-600 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 overflow-hidden">
                      {msg?.senderId?.avatar ? (
                        <img
                          src={msg?.senderId?.avatar}
                          alt={msg?.senderId?.fullname || "Avatar"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        "👤"
                      )}
                    </div>
                  )}

                  <div className="flex flex-col mb-1">
                    <MessagesItemMedia msg={msg} isOwnMessage={isOwnMessage} />

                    <div
                      className={clsx(
                        "flex flex-row items-center",
                        isOwnMessage && "flex-row-reverse gap-2"
                      )}
                    >
                      {/* Message Bubble */}
                      <MessagesItem
                        index={index}
                        msg={msg}
                        messages={messages || []}
                        isOwnMessage={isOwnMessage}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                        clickedMessageId={clickedMessageId}
                      />

                      {/* Action Menu (hover to show) */}
                      <div className="ml-2 hidden group-hover:flex items-center space-x-1">
                        <button
                          className={clsx(
                            "text-xs px-2 py-1 rounded-md shadow",
                            "text-gray-800 dark:text-white bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600",
                            {
                              hidden: msg?.isSent === false,
                            }
                          )}
                          onClick={() => {
                            setReplyMessage(msg);
                            scrollToBottom();
                          }}
                        >
                          <Reply className="inline-block" size={16} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === msg?._id ? null : msg?._id
                              )
                            }
                            className={clsx(
                              "text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-md text-gray-800 dark:text-white shadow",
                              {
                                hidden: msg?.isSent === false,
                              }
                            )}
                          >
                            <Ellipsis className="inline-block" size={16} />
                          </button>

                          {openMenuId === msg?._id && (
                            <MessagesItemMenu
                              isOwnMessage={isOwnMessage}
                              groupId={groupId}
                              messageId={msg._id}
                              msg={msg}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* {isOwnMessage && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm text-white flex-shrink-0 ml-2">
                  {msg.senderId.avatar || "👤"}
                </div>
              )} */}
                </div>
                {(showTime || clickedMessageId === msg._id) && (
                  <div className="w-full flex justify-center items-center text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeMessageChat(msg.createdAt)}
                  </div>
                )}
              </Fragment>
            );
          })}

        {!isFetching && messages.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full w-full text-gray-500 dark:text-gray-400 select-none">
            <div className="mb-3">
              <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-lg font-semibold mb-1">Chưa có tin nhắn nào</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Hãy bắt đầu cuộc trò chuyện đầu tiên!
            </p>
          </div>
        )}
        {!isFetchingNextPage && isFetching && (
          <div className="flex justify-center items-center py-4">
            <svg
              className="animate-spin h-6 w-6 text-gray-500 dark:text-gray-400 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="text-gray-500 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        )}
        {!isFetchingNextPage && hasNextPage && (
          <div ref={targetRef} className="h-10" />
        )}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-4">
            <span className="text-gray-500 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default MessagesChat;
