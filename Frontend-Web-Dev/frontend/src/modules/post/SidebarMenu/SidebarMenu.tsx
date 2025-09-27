"use client";

import {
  Heart,
  MessageCircle,
  Bookmark,
  Share,
  MoreHorizontal,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { message as messageAntd } from "antd";

import type { PostWithTotalComments } from "@/service/api/post/types";

import { useGetInfoUser } from "@/modules/user/hooks";
import {
  EnumPostReactionType,
  listEmojiReactions,
} from "@/service/api/post/types";
import { updateReactionPost } from "@/service/api/post";

interface ReactionOption {
  id: string;
  emoji: string;
  count: number;
  onClick?: () => void;
}

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  count: number;
  reactions?: ReactionOption[];
  menuOptions?: string[];
}

type SidebarMenuProps = {
  post: PostWithTotalComments;
};

const SidebarMenu = (props: SidebarMenuProps) => {
  const { data: userInfo } = useGetInfoUser();
  const [dataPost, setDataPost] = useState<PostWithTotalComments>(props.post);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const totalReactions = dataPost.reactions.reduce(
    (acc, reaction) => acc + reaction.listUserId.length,
    0
  );

  const sidebarItems: SidebarItem[] = [
    {
      id: "likes",
      icon: <Heart className="w-6 h-6" />,
      count: totalReactions,
    },
    {
      id: "comments",
      icon: <MessageCircle className="w-6 h-6" />,
      count: props?.post?.totalComments || 0,
      menuOptions: ["View comments", "Disable comments", "Comment settings"],
    },
    {
      id: "bookmarks",
      icon: <Bookmark className="w-6 h-6" />,
      count: 0,
      menuOptions: ["View bookmarks", "Add to bookmarks", "Manage folders"],
    },
    {
      id: "share",
      icon: <Share className="w-6 h-6" />,
      count: 0,
      menuOptions: [
        "Copy link",
        "Share to Twitter",
        "Share to Facebook",
        "Share via email",
      ],
    },
  ];

  const { mutate: updateReactionMutation, isPending: isPendingUpdateReaction } =
    useMutation({
      mutationFn: (data: {
        postId: string;
        type: EnumPostReactionType;
        increment: boolean;
      }) => updateReactionPost(data),
      onSuccess: (data) => {},
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

  const handleItemClick = (itemId: string) => {
    setActiveMenu(activeMenu === itemId ? null : itemId);
  };

  const handleReactionClick = (data: {
    increment: boolean;
    postId: string;
    type: EnumPostReactionType;
  }) => {
    // Cập nhật lại dữ liệu bài viết sau khi phản ứng
    setDataPost((prev) => {
      // Kiểm tra xem reaction này đã tồn tại chưa
      const reactionExists = prev.reactions.some(
        (reaction) => reaction.type === data.type
      );

      let updatedReactions;
      if (reactionExists) {
        updatedReactions = prev.reactions.map((reaction) => {
          if (reaction.type === data.type) {
            const hasReacted = reaction?.listUserId?.some(
              (user) => user?._id === userInfo?._id
            );
            return {
              ...reaction,
              listUserId: hasReacted
                ? reaction.listUserId.filter(
                    (user) => user?._id !== userInfo?._id
                  )
                : [
                    ...reaction.listUserId,
                    userInfo
                      ? {
                          _id: userInfo._id,
                          fullname: userInfo.fullname,
                          email: userInfo.email,
                          avatar: userInfo.avatar,
                        }
                      : {
                          _id: "",
                          fullname: "",
                          email: "",
                          avatar: "",
                        },
                  ],
            };
          }
          return reaction;
        });
      } else {
        // Nếu chưa có reaction này thì thêm mới
        updatedReactions = [
          ...prev.reactions,
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            type: data.type,
            listUserId: userInfo
              ? [
                  {
                    _id: userInfo._id,
                    fullname: userInfo.fullname,
                    email: userInfo.email,
                    avatar: userInfo.avatar,
                  },
                ]
              : [],
          },
        ];
      }
      return { ...prev, reactions: updatedReactions };
    });

    updateReactionMutation({
      postId: data.postId,
      type: data.type,
      increment: data.increment,
    });
  };

  const handleMenuOptionClick = (option: string) => {
    console.log("Menu option clicked:", option);
    setActiveMenu(null);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={clsx(
          "relative bg-white dark:bg-[#3825657d] border-r border-gray-200 dark:border-gray-700 p-4",
          "rounded-lg shadow-md"
        )}
      >
        <div className="flex flex-col space-y-6">
          {sidebarItems.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => {
                  if (item.id === "comments") {
                    //di chuyển đến phần bình luận
                    const commentsSection = document.getElementById("comments");
                    commentsSection?.scrollIntoView({ behavior: "smooth" });
                    return;
                  }
                  return handleItemClick(item.id);
                }}
                className={clsx(
                  "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-violet-900",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500",
                  activeMenu === item.id && "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <div
                  className={clsx(
                    "text-gray-600 dark:text-white",
                    activeMenu === item.id && "text-gray-800 dark:text-gray-200"
                  )}
                >
                  {item.icon}
                </div>
                <span
                  className={clsx(
                    "text-sm font-medium",
                    "text-gray-600 dark:text-white",
                    activeMenu === item.id && "text-gray-800 dark:text-gray-200"
                  )}
                >
                  {item.count}
                </span>
              </button>

              {/* Menu Popup */}
              {activeMenu === item.id && (
                <div
                  className="absolute left-16 top-0"
                  style={{ zIndex: 9999 }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 px-4 py-3">
                    {
                      item.id === "likes" && (
                        <div className="flex items-center space-x-6">
                          {listEmojiReactions.map((reaction) => {
                            // kiểm tra xem user đã react chưa
                            const hasReacted = dataPost.reactions.some(
                              (r) =>
                                r?.type === reaction?.id &&
                                r?.listUserId.some(
                                  (u) => u?._id === userInfo?._id
                                )
                            );
                            return (
                              <button
                                key={reaction.id}
                                onClick={() => {
                                  if (isPendingUpdateReaction) {
                                    return messageAntd.open({
                                      type: "info",
                                      content:
                                        "Đang xử lý phản ứng, vui lòng đợi...",
                                    });
                                  }
                                  return handleReactionClick({
                                    increment: !hasReacted,
                                    postId: dataPost._id,
                                    type: reaction.id,
                                  });
                                }}
                                className="flex flex-col items-center space-y-1 hover:scale-110 transition-transform"
                              >
                                <span className="text-2xl">
                                  {reaction.emoji}
                                </span>
                                <span
                                  className={clsx(
                                    "text-xs font-medium",
                                    hasReacted
                                      ? "text-blue-500 dark:text-blue-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  )}
                                >
                                  {dataPost.reactions.find(
                                    (r) => r.type === reaction.id
                                  )?.listUserId.length || 0}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )

                      //   <div className="min-w-[180px] space-y-1 py-2">
                      //     {item.menuOptions?.map((option, index) => (
                      //       <button
                      //         key={index}
                      //         onClick={() => handleMenuOptionClick(option)}
                      //         className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      //       >
                      //         {option}
                      //       </button>
                      //     ))}
                      //   </div>
                    }
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* More options button */}
          <div className="relative">
            <button
              onClick={() => handleItemClick("more")}
              className={clsx(
                "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                activeMenu === "more" && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              <div
                className={clsx(
                  "text-gray-600 dark:text-gray-400",
                  activeMenu === "more" && "text-gray-800 dark:text-gray-200"
                )}
              >
                <MoreHorizontal className="w-6 h-6" />
              </div>
            </button>

            {/* More Menu Popup */}
            {activeMenu === "more" && (
              <div className="absolute left-16 top-0 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 px-2 py-2">
                  <div className="min-w-[180px] space-y-1">
                    <button
                      onClick={() => handleMenuOptionClick("settings")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => handleMenuOptionClick("help")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      Help & Support
                    </button>
                    <button
                      onClick={() => handleMenuOptionClick("feedback")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      Send Feedback
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area (optional) */}
      {/* <div className="flex-1 p-6 bg-white dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Main Content Area
          </h2>
          <p>Click on the sidebar icons to see the menu options.</p>
          {activeMenu && (
            <p className="mt-2 text-blue-600 dark:text-blue-400">
              Current active menu: {activeMenu}
            </p>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default SidebarMenu;
export { SidebarMenu };
