"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { useGetInfoUser } from "@/modules/user/hooks";

interface IFriend {
  _id: string;
  fullname: string;
  avatar: string;
  email: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
  mutualFriends?: number;
}

interface FriendsListProps {
  className?: string;
}

const FriendsList = (props: FriendsListProps) => {
  // Sample data - trong thực tế sẽ fetch từ API
  //   const [friends] = useState<Friend[]>([
  //     {
  //       _id: "1",
  //       fullname: "Nguyễn Văn An",
  //       avatar:
  //         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  //       status: "online",
  //       mutualFriends: 12,
  //     },
  //     {
  //       _id: "2",
  //       name: "Trần Thị Bình",
  //       avatar:
  //         "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  //       status: "away",
  //       lastSeen: "2 giờ trước",
  //       mutualFriends: 8,
  //     },
  //     {
  //       id: "3",
  //       name: "Lê Minh Cường",
  //       avatar:
  //         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  //       status: "offline",
  //       lastSeen: "1 ngày trước",
  //       mutualFriends: 5,
  //     },
  //     {
  //       id: "4",
  //       name: "Phạm Thu Dung",
  //       avatar:
  //         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  //       status: "online",
  //       mutualFriends: 15,
  //     },
  //     {
  //       id: "5",
  //       name: "Hoàng Văn Em",
  //       avatar:
  //         "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  //       status: "offline",
  //       lastSeen: "3 ngày trước",
  //       mutualFriends: 3,
  //     },
  //   ]);
  const { data: userInfo } = useGetInfoUser();

  const [friends, setFriends] = useState<IFriend[] | []>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "online" | "offline" | "away"
  >("all");

  useEffect(() => {
    if (userInfo?.listFriendId && userInfo.listFriendId.length > 0) {
      // Map listFriendId to ensure all required fields exist and add missing fields if needed
      const mappedFriends = userInfo.listFriendId.map((friend) => ({
        _id: friend._id,
        fullname: friend.fullname || "",
        avatar: friend.avatar || "",
        email: friend.email || "",
        status: "online" as "online", // Giả sử trạng thái là online, có thể thay đổi theo logic thực tế
        lastSeen: "", // Giả sử không có lastSeen, có thể thay đổi theo logic thực tế
      }));
      setFriends(mappedFriends);
    }
  }, [userInfo]);

  const filteredFriends = friends.filter((friend) => {
    const matchesSearch = friend.fullname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || friend.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: IFriend["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-zinc-400 dark:bg-zinc-500";
      default:
        return "bg-zinc-400 dark:bg-zinc-500";
    }
  };

  const getStatusText = (friend: IFriend) => {
    switch (friend.status) {
      case "online":
        return "Đang hoạt động";
      case "away":
        return "Vắng mặt";
      case "offline":
        return friend.lastSeen
          ? `Hoạt động ${friend.lastSeen}`
          : "Không hoạt động";
      default:
        return "Không xác định";
    }
  };

  return (
    <div
      className={clsx(
        "w-full bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden",
        props.className
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Bạn bè ({friends.length})
        </h2>
      </div>

      {/* Search và Filter */}
      <div className="px-6 py-4 space-y-3 border-b border-zinc-200 dark:border-zinc-700">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={clsx(
              "w-full pl-4 pr-4 py-2 rounded-lg border transition-colors",
              "border-zinc-300 dark:border-zinc-600",
              "bg-white dark:bg-zinc-700",
              "text-zinc-900 dark:text-white",
              "placeholder-zinc-500 dark:placeholder-zinc-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            )}
          />
        </div>

        {/* Status Filter */}
        <div className="flex space-x-2">
          {(["all", "online", "away", "offline"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={clsx(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                statusFilter === status
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
              )}
            >
              {status === "all"
                ? "Tất cả"
                : status === "online"
                ? "Trực tuyến"
                : status === "away"
                ? "Vắng mặt"
                : "Ngoại tuyến"}
            </button>
          ))}
        </div>
      </div>

      {/* Friends List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredFriends.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">
              {searchTerm ? "Không tìm thấy bạn bè nào" : "Chưa có bạn bè"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className={clsx(
                  "px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                )}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar với status indicator */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.fullname}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                      className={clsx(
                        "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-800",
                        getStatusColor(friend.status)
                      )}
                    />
                  </div>

                  {/* Friend Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                      {friend.fullname}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {getStatusText(friend)}
                    </p>
                    {friend.mutualFriends && (
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {friend.mutualFriends} bạn chung
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      className={clsx(
                        "p-2 rounded-full transition-colors",
                        "text-zinc-400 dark:text-zinc-500",
                        "hover:text-blue-500 dark:hover:text-blue-400",
                        "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      )}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </button>
                    <button
                      className={clsx(
                        "p-2 rounded-full transition-colors",
                        "text-zinc-400 dark:text-zinc-500",
                        "hover:text-green-500 dark:hover:text-green-400",
                        "hover:bg-green-50 dark:hover:bg-green-900/20"
                      )}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
export { FriendsList };
