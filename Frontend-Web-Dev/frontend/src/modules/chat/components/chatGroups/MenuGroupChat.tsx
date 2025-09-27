"use client";

import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import {
  X,
  ChevronDown,
  ChevronRight,
  Users,
  FileText,
  Link,
  Settings,
  Shield,
  AlertTriangle,
  LogOut,
  Search,
  MessageSquare,
  Eye,
  Archive,
  Bell,
  BellOff,
  Star,
  MoreHorizontal,
  Pin,
  UserPlus,
  ChevronLeft,
  Images,
  Crop,
  AppWindow,
  Film,
  Key,
} from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getChatGroupById } from "@/service/api/chat";
import { queryKeys } from "@/constants/Common";
import { getJoinRequests } from "@/service/api/chat";
import { message } from "antd";

import {
  EnumRoleParticipants,
  TypeRoleParticipants,
  IParticipants,
} from "@/service/api/chat/types/GroupConversations";
import type {
  TypeFeedbackGroupJoinRequest,
  TypeGetGroupJoinRequestsResponse,
  IGroupJoinRequests,
} from "@/service/api/chat/types/GroupJoinRequests";
import type { IGroupConversations } from "@/service/api/chat/types/GroupConversations";
import type { AxiosResponse } from "@/lib/axiosInstance";
import { feedbackJoinRequest } from "@/service/api/chat";
import { useGetInfoUser } from "@/modules/user/hooks";
import { convertByte } from "@/shared/utils/convertByte";
import { useMainChatContext } from "@/modules/chat/components/chatGroups/MainChat";

import { ModalUpdatePermissions } from "@/modules/chat/components/modal/ModalUpdatePermissions";
import { ModalUpdateInfoGroup } from "@/modules/chat/components/modal/ModalUpdateInfoGroup";
import { ModalLeaveGroup } from "@/modules/chat/components/modal/ModalLeaveGroup";

//------------------------------------------------------
type TypeSubMenuChatProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const SubMenuManage = (props: TypeSubMenuChatProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={menuRef}
      className={clsx(
        "absolute top-0 left-0 w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-lg transition-transform duration-300 ease-in-out",
        props.isOpen ? "translate-x-0" : "-translate-x-full",
        "min-h-screen",
        "z-50"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800">
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => props.setIsOpen(false)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center flex-1">
          Quản lý nhóm
        </h2>
        <div className="flex-1" />
      </div>

      <div className="flex-1 overflow-y-auto"></div>
    </div>
  );
};

//------------------------------------------------------
type TypeSubMenuFileMediaProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const SubMenuFileMedia = (props: TypeSubMenuFileMediaProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={menuRef}
      className={clsx(
        "absolute top-0 left-0 w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-lg transition-transform duration-300 ease-in-out",
        props.isOpen ? "translate-x-0" : "-translate-x-full",
        "min-h-screen",
        "z-50"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800">
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => props.setIsOpen(false)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center flex-1">
          Kho lưu trữ
        </h2>
        <div className="flex-1" />
      </div>

      <div className="flex-1 overflow-y-auto"></div>
    </div>
  );
};
//------------------------------------------------------
type TypeSubMenuMembersProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  listParticipants: IGroupConversations["participants"];
  groupId: string;
};

const SubMenuMembers = (props: TypeSubMenuMembersProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);
  const [isOpenUpdatePermissions, setIsOpenUpdatePermissions] = useState(false);
  const [selectedUserParticipant, setSelectedUserParticipant] =
    useState<IParticipants | null>(null);

  // Dữ liệu thành viên mẫu
  const members = [
    {
      id: "1",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      fullname: "Nguyễn Văn A",
      email: "vana@example.com",
      role: "Thành viên",
      joinedAt: "2023-12-01T10:00:00Z",
    },
    {
      id: "2",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      fullname: "Trần Thị B",
      email: "thib@example.com",
      role: "Quản trị viên",
      joinedAt: "2023-11-15T14:30:00Z",
    },
    {
      id: "3",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
      fullname: "Lê Văn C",
      email: "vanc@example.com",
      role: "Thành viên",
      joinedAt: "2024-01-10T09:15:00Z",
    },
    {
      id: "4",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      fullname: "Phạm Thị D",
      email: "thid@example.com",
      role: "Trưởng nhóm",
      joinedAt: "2023-10-05T08:45:00Z",
    },
  ];

  const getColorRole = (role: TypeRoleParticipants) => {
    switch (role) {
      case EnumRoleParticipants.CREATOR:
        return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300";
      case EnumRoleParticipants.ADMIN:
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
      case EnumRoleParticipants.MEMBER:
        return "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <>
      <div
        ref={menuRef}
        className={clsx(
          "absolute top-0 left-0 w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-lg transition-transform duration-300 ease-in-out",
          props.isOpen ? "translate-x-0" : "-translate-x-full",
          "min-h-screen",
          "z-50"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800">
          <div className="flex-1 flex justify-start">
            <button
              onClick={() => props.setIsOpen(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center flex-1">
            Thành viên
          </h2>
          <div className="flex-1" />
        </div>

        <div className="flex-1 min-h-screen overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-4">
            {props.listParticipants?.map((participant) => {
              return (
                <div
                  key={participant?.userId?._id}
                  className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={participant?.userId?.avatar || ""}
                    alt={participant?.userId?.fullname || "Avatar"}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white truncate">
                        {participant?.userId?.fullname || "(Chưa có tên)"}
                      </span>
                      <div
                        className={clsx(
                          "text-xs px-2 py-0.5 rounded",
                          getColorRole(
                            participant?.role || EnumRoleParticipants.MEMBER
                          )
                        )}
                      >
                        {participant?.role === EnumRoleParticipants.CREATOR ? (
                          <span className="flex items-center">
                            Chủ sở hữu <Key className="inline w-4 h-4 ml-1" />
                          </span>
                        ) : participant?.role === EnumRoleParticipants.ADMIN ? (
                          "Quản trị viên"
                        ) : (
                          "Thành viên"
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {participant?.userId?.email || "(Chưa có email)"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Tham gia:{" "}
                      {participant?.joinedAt
                        ? new Date(participant.joinedAt).toLocaleString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )
                        : "(Chưa có ngày tham gia)"}
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenuFor(participant?.userId?._id);
                      }}
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    {showMenuFor === participant?.userId?._id && (
                      <div
                        className="absolute right-0 top-10 z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[160px] py-2"
                        tabIndex={-1}
                      >
                        {/* Overlay to detect outside click */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowMenuFor(null)}
                          tabIndex={-1}
                          aria-hidden="true"
                        />
                        <div className="relative z-50">
                          <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-white">
                            Xem hồ sơ
                          </button>
                          <button
                            onClick={() => {
                              setIsOpenUpdatePermissions(true);
                              setSelectedUserParticipant(participant);
                              setShowMenuFor(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-white"
                          >
                            Quyền và vai trò
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-white">
                            Gỡ khỏi nhóm
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isOpenUpdatePermissions && (
        <ModalUpdatePermissions
          isOpen={isOpenUpdatePermissions}
          onCancel={() => {
            setIsOpenUpdatePermissions(false);
            setSelectedUserParticipant(null);
          }}
          groupId={props.groupId}
          participant={selectedUserParticipant}
          title={`Quyền hạn của ${selectedUserParticipant?.userId?.fullname}`}
          onOk={() => {
            setIsOpenUpdatePermissions(false);
            setSelectedUserParticipant(null);
          }}
        />
      )}
    </>
  );
};
//------------------------------------------------------
type TypeSubMenuMembersApprovalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupId: string;
};

type TypeItemJoinRequest = {
  item: IGroupJoinRequests;
  groupId: string;
};

const ItemJoinRequest = (props: TypeItemJoinRequest) => {
  const queryClient = useQueryClient();
  const { mutate: feedbackJoinRequestMutation, isPending } = useMutation({
    mutationFn: (data: TypeFeedbackGroupJoinRequest) =>
      feedbackJoinRequest(data),
    onSuccess: (_data) => {
      //console.log("feedbackJoinRequestMutation", _data);
      queryClient.setQueryData(
        [queryKeys.GET_ALL_CHAT_GROUP_JOIN_REQUEST, props.groupId],
        (oldData: AxiosResponse<TypeGetGroupJoinRequestsResponse>) => {
          if (!oldData || !oldData.data) return oldData;
          const updatedData = {
            ...oldData,
            data: {
              ...oldData?.data,
              data: oldData?.data?.data?.filter(
                (item) => item?._id !== props?.item?._id
              ),
            },
          };
          return updatedData;
        }
      );
      queryClient.invalidateQueries({
        queryKey: [queryKeys.CHAT_GROUP_DETAIL, props.groupId],
      });
    },
    onError: (error: any) => {
      message.open({
        type: "error",
        content:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
    },
    retry: 3,
    retryDelay: 2000,
  });
  return (
    <>
      <div
        key={props.item._id}
        className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 flex items-start gap-4 shadow-sm"
      >
        <img
          src={props.item?.userId?.avatar}
          alt={props.item?.userId?.fullname}
          className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              {props.item?.userId?.fullname}
            </span>
            <span className="text-xs text-gray-400">
              {props.item?.userId?.email}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            {props.item?.requestMessage}
          </div>

          <div className="mt-2 flex gap-2">
            {!isPending && (
              <>
                <button
                  onClick={() =>
                    feedbackJoinRequestMutation({
                      groupJoinRequestId: props.item._id,
                      action: "APPROVED",
                      groupId: props.groupId,
                    })
                  }
                  className="px-3 py-1.5 rounded-md bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
                >
                  Chấp nhận
                </button>
                <button className="px-3 py-1.5 rounded-md hover:bg-red-600 text-white text-sm font-medium transition-colors bg-red-500">
                  Từ chối
                </button>
              </>
            )}
            {isPending && (
              <button
                disabled
                className="px-3 py-1.5 rounded-md bg-gray-400 text-white text-sm font-medium cursor-not-allowed"
              >
                Đang xử lý...
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Gửi lúc: {new Date(props.item?.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );
};
const SubMenuMembersApproval = (props: TypeSubMenuMembersApprovalProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: dataJoinRequests,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_ALL_CHAT_GROUP_JOIN_REQUEST, props.groupId],
    queryFn: () => getJoinRequests(props.groupId),
    enabled: props.isOpen ? true : false, //chỉ gọi API khi menu mở
    gcTime: 1000 * 60 * 60, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  //console.log("joinRequests", dataJoinRequests);

  return (
    <div
      ref={menuRef}
      className={clsx(
        "absolute top-0 left-0 w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-lg transition-transform duration-300 ease-in-out",
        props.isOpen ? "translate-x-0" : "-translate-x-full",
        "min-h-screen",
        "z-50"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800">
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => props.setIsOpen(false)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center flex-1">
          Duyệt thành viên
        </h2>
        <div className="flex-1" />
        {/* Menu duyệt tất cả / từ chối tất cả chỉ hiện khi click */}
        <div className="relative"></div>
        <button
          className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
          onClick={() => setShowBulkMenu(!showBulkMenu)}
          type="button"
        >
          Thao tác
          <ChevronDown className="w-4 h-4" />
        </button>
        {showBulkMenu && (
          <div
            className="absolute py-2 top-12 right-3 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
            tabIndex={-1}
            ref={(el) => {
              if (el) {
                // Focus for blur event
                el.focus();
              }
            }}
            onBlur={() => setShowBulkMenu(false)}
          >
            <button
              className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-white text-sm font-medium transition-colors text-left"
              // onClick={handleApproveAll}
            >
              Duyệt tất cả
            </button>
            <button
              className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-white text-sm font-medium transition-colors text-left"
              // onClick={handleRejectAll}
            >
              Từ chối tất cả
            </button>
            <button
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: [
                    queryKeys.GET_ALL_CHAT_GROUP_JOIN_REQUEST,
                    props.groupId,
                  ],
                });
                message.success("Đã tải lại yêu cầu phê duyệt");
              }}
              className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium transition-colors text-left"
              // onClick={handleRejectAll}
            >
              Tải lại
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {dataJoinRequests && dataJoinRequests?.data?.data?.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            Không có yêu cầu phê duyệt nào.
          </div>
        ) : (
          dataJoinRequests?.data?.data?.map((item) => (
            <ItemJoinRequest
              key={item._id}
              item={item}
              groupId={props.groupId}
            />
          ))
        )}

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-start gap-4 animate-pulse"
              >
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-7 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="h-7 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-red-500 text-center py-4 flex flex-col items-center gap-2">
            <div>Đã xảy ra lỗi khi tải dữ liệu.</div>
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors text-sm font-medium"
              onClick={() => {}}
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

//------------------------------------------------------
type TypeMenuChatProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupId: string;
};

const MenuGroupChat = (props: TypeMenuChatProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: userInfo } = useGetInfoUser();
  const [isOpenSubMenuManage, setIsOpenSubMenuManage] = useState(false);
  const [isOpenSubMenuFileMedia, setIsOpenSubMenuFileMedia] = useState(false);
  const [isOpenSubMenuMembers, setIsOpenSubMenuMembers] = useState(false);
  const [isOpenSubMenuMembersApproval, setIsOpenSubMenuMembersApproval] =
    useState(false);

  const [isOpenModalUpdateInfoGroup, setIsOpenModalUpdateInfoGroup] =
    useState(false);
  const [isOpenModalLeaveGroup, setIsOpenModalLeaveGroup] = useState(false);

  const { setInfoUserInGroup, infoUserInGroup } = useMainChatContext();

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

  //console.log("chatGroupDetail", chatGroupDetail);

  const [expandedSections, setExpandedSections] = useState({
    members: true,
    news: true,
    files: true,
    links: false,
    security: false,
    membersApproval: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getFileIcon = (mimetype: string) => {
    switch (mimetype) {
      case "application/pdf":
        return <FileText className="w-5 h-5 text-gray-50 dark:text-gray-100" />;
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        return <Images className="w-5 h-5 text-gray-50 dark:text-gray-100" />;
      case "video/mp4":
        return <Film className="w-5 h-5 text-gray-50 dark:text-gray-100" />;
      //file exe
      case "application/x-msdownload":
        return (
          <AppWindow className="w-5 h-5 text-gray-50 dark:text-gray-100" />
        );
      default:
        return <FileText className="w-5 h-5 text-gray-50 dark:text-gray-100" />;
    }
  };

  const getFileColor = (mimetype: string) => {
    switch (mimetype) {
      case "application/pdf":
        return "bg-red-500";
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        return "bg-blue-500";
      case "video/mp4":
        return "bg-green-500";
      //file exe
      case "application/x-msdownload":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  //lấy thông báo của người dùng trong nhóm
  const notificationUserInGroup =
    chatGroupDetail?.data?.data?.participants?.find(
      (user) => user?.userId?._id === userInfo?._id
    )?.notification;

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
  //infoUserInGroup?.role;

  //lấy danh sách file ảnh và video trong nhóm
  const listFileImagesOrVideos =
    (chatGroupDetail?.data?.data?.listFileKey || [])
      .map((arr) => arr?.[0])
      .filter(
        (file) =>
          file &&
          (file.mimetype?.startsWith("image/") ||
            file.mimetype?.startsWith("video/"))
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6) || [];

  //lấy danh sách file khác ảnh và video
  const listFileDocuments =
    (chatGroupDetail?.data?.data?.listFileKey || [])
      .map((arr) => arr?.[0])
      .filter(
        (file) =>
          file &&
          !(
            file.mimetype?.startsWith("image/") ||
            file.mimetype?.startsWith("video/")
          )
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6) || [];

  //danh sách thành viên trong nhóm
  const listParticipants = chatGroupDetail?.data?.data?.participants || [];
  //console.log("listFileDocuments", listFileDocuments);
  //console.log("listFileImagesOrVideos", listFileImagesOrVideos);

  return (
    <>
      <div
        ref={menuRef}
        className={clsx(
          "absolute top-0 left-0 w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-lg transition-transform duration-300 ease-in-out",
          props.isOpen ? "translate-x-0" : "-translate-x-full",
          "min-h-screen",
          "z-50"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800">
          <div className="flex-1" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            Thông tin nhóm
          </h2>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => props.setIsOpen(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {chatGroupDetail?.data?.data && (
          <div
            className={clsx("flex-1 overflow-y-auto", {
              hidden:
                isOpenSubMenuManage ||
                isOpenSubMenuFileMedia ||
                isOpenSubMenuMembers ||
                isOpenSubMenuMembersApproval,
            })}
          >
            {/* Group Info */}
            <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-4">
                <div className="relative w-16 h-16 rounded-full shadow-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                  <img
                    src={
                      chatGroupDetail.data.data.avatar ||
                      "/image/group_chat_default.png"
                    }
                    alt="Group Avatar"
                    className={clsx(
                      "w-full h-full object-cover absolute z-0 overflow-hidden rounded-full",
                      "hover:scale-110 transition-transform duration-200 cursor-pointer"
                    )}
                  />
                  {/* Edit Avatar Button */}
                  <button
                    className={clsx(
                      "absolute z-10 -bottom-1 -right-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full p-1 shadow hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    )}
                    title="Sửa ảnh nhóm"
                    onClick={() => {
                      if (!infoUserInGroup?.permissions?.can_change_info) {
                        return message.error(
                          "Bạn không có quyền thay đổi thông tin nhóm"
                        );
                      }
                      return setIsOpenModalUpdateInfoGroup(true);
                    }}
                    type="button"
                  >
                    <Crop className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                {chatGroupDetail.data.data.title || "(Tên nhóm)"}
              </h3>
              <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                <span>
                  {chatGroupDetail.data.data.participants?.length || 0} thành
                  viên
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-4 gap-3">
                <button className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200",
                      "bg-gray-100 dark:bg-gray-800 group-hover:scale-110"
                    )}
                  >
                    <Bell className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 text-center leading-tight font-medium">
                    {notificationUserInGroup?.is_muted
                      ? "Bật thông báo"
                      : "Tắt thông báo"}
                  </span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200",
                      "bg-gray-100 dark:bg-gray-800 group-hover:scale-110"
                    )}
                  >
                    <Pin className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 text-center leading-tight font-medium">
                    Ghim tin nhắn
                  </span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200",
                      "bg-gray-100 dark:bg-gray-800 group-hover:scale-110"
                    )}
                  >
                    <UserPlus className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 text-center leading-tight font-medium">
                    Thêm thành viên
                  </span>
                </button>
                <button
                  onClick={() => setIsOpenSubMenuManage(true)}
                  className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                >
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200",
                      "bg-gray-100 dark:bg-gray-800 group-hover:scale-110"
                    )}
                  >
                    <Settings className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 text-center leading-tight font-medium">
                    Quản lý nhóm
                  </span>
                </button>
              </div>
            </div>

            {/* Members Section */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection("members")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Thành viên nhóm
                  </span>
                </div>
                {expandedSections.members ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.members && (
                <div className="px-4 pb-4 mt-2">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">
                        {chatGroupDetail.data.data.participants?.length || 0}{" "}
                        thành viên
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpenSubMenuMembers(true);
                    }}
                    className="w-full mt-2 py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors font-medium"
                  >
                    Xem tất cả
                  </button>
                </div>
              )}
            </div>

            {/* Members Approval Section */}
            {infoUserInGroup?.role === EnumRoleParticipants.ADMIN ||
              (infoUserInGroup?.role === EnumRoleParticipants.CREATOR && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => toggleSection("membersApproval")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Phê duyệt thành viên
                      </span>
                    </div>
                    {expandedSections.membersApproval ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.membersApproval && (
                    <div className="px-4 pb-4 mt-2">
                      <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400">
                          <UserPlus className="w-4 h-4" />
                          <span className="font-medium">
                            {/* Số lượng chờ phê duyệt, thay thế 0 nếu có dữ liệu */}
                            0 thành viên chờ phê duyệt
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsOpenSubMenuMembersApproval(true);
                        }}
                        className="w-full mt-2 py-2.5 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition-colors font-medium"
                      >
                        Xem tất cả
                      </button>
                    </div>
                  )}
                </div>
              ))}

            {/* News Section */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection("news")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Bảng tin nhóm
                  </span>
                </div>
                {expandedSections.news ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.news && (
                <div className="px-4 pb-4 space-y-3 mt-2">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Danh sách chức năng
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Chi tiết ghim bình chọn
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Media Section */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4 ">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <img className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Ảnh/Video
                  </h4>
                </div>

                {listFileImagesOrVideos.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {listFileImagesOrVideos.map((file, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Play video and hide overlay
                            const video = document.getElementById(
                              `video-preview-${index}`
                            ) as HTMLVideoElement;
                            const overlay = document.getElementById(
                              `video-overlay-${index}`
                            );
                            if (video) {
                              video.play();
                            }
                            if (overlay) {
                              overlay.style.display = "none";
                            }
                          }}
                        >
                          {file.mimetype?.startsWith("video/") ? (
                            <>
                              <video
                                id={`video-preview-${index}`}
                                src={file.url}
                                title={file.originalname}
                                className="w-full h-full object-cover"
                                controls={false}
                                preload="metadata"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const video = e.currentTarget;
                                  const overlay = document.getElementById(
                                    `video-overlay-${index}`
                                  );
                                  if (video.paused) {
                                    video.play();
                                    if (overlay) overlay.style.display = "none";
                                  } else {
                                    video.pause();
                                    if (overlay) overlay.style.display = "";
                                  }
                                }}
                              />
                              {/* Overlay play button */}
                              <div
                                id={`video-overlay-${index}`}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                                style={{ pointerEvents: "none" }}
                              >
                                <svg
                                  className="w-10 h-10 text-white opacity-90"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <polygon points="8,5 19,12 8,19" />
                                </svg>
                              </div>
                            </>
                          ) : (
                            <img
                              src={file.url}
                              alt={file.originalname}
                              title={file.originalname}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110 hover:opacity-60"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors font-medium">
                      Xem tất cả
                    </button>
                  </>
                ) : (
                  <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Images className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chưa có ảnh hoặc video nào được chia sẻ trong nhóm này.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Files Section */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <button
                  onClick={() => toggleSection("files")}
                  className="w-full mb-4 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      File
                    </span>
                  </div>
                  {/* {expandedSections.files ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )} */}
                </button>
                {/* {expandedSections.files && (
                <div className="px-4 pb-4 space-y-3 mt-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div
                        className={clsx(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          getFileColor(file.type)
                        )}
                      >
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {file.size} • {file.date}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setIsOpenSubMenuFileMedia(true);
                    }}
                    className="w-full py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors font-medium"
                  >
                    Xem tất cả
                  </button>
                </div>
              )} */}
                {listFileDocuments.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {listFileDocuments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          <div
                            className={clsx(
                              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                              getFileColor(file.mimetype)
                            )}
                          >
                            {getFileIcon(file.mimetype)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {file.originalname}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {convertByte(file.size)} •{" "}
                              {new Date(file.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setIsOpenSubMenuFileMedia(true);
                      }}
                      className="w-full mt-4 py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors font-medium"
                    >
                      Xem tất cả
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Archive className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Chưa có file nào được chia sẻ trong nhóm này.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Links Section */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection("links")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Link className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Link
                  </span>
                </div>
                {expandedSections.links ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.links && (
                <div className="px-4 pb-4 mt-2">
                  <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Link className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chưa có Link được chia sẻ trong nhóm blog này
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Security Settings */}
            <div>
              <button
                onClick={() => toggleSection("security")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Thiết lập bảo mật
                  </span>
                </div>
                {expandedSections.security ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.security && (
                <div className="px-4 pb-6 space-y-3 mt-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        Tin nhắn tự xóa
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Chỉ dành cho trưởng nhóm
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Ẩn trò chuyện
                      </span>
                    </div>
                    <div className="w-10 h-6 bg-gray-300 dark:bg-zinc-600 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform shadow-sm"></div>
                    </div>
                  </div>

                  <button className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors w-full text-left">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Báo xấu
                    </span>
                  </button>

                  <button className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors w-full text-left">
                    <Archive className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Xóa lịch sử trò chuyện
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOpenModalLeaveGroup(true);
                    }}
                    className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Rời khỏi nhóm
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <SubMenuManage
        isOpen={isOpenSubMenuManage}
        setIsOpen={setIsOpenSubMenuManage}
      />
      <SubMenuFileMedia
        isOpen={isOpenSubMenuFileMedia}
        setIsOpen={setIsOpenSubMenuFileMedia}
      />
      <SubMenuMembers
        isOpen={isOpenSubMenuMembers}
        setIsOpen={setIsOpenSubMenuMembers}
        listParticipants={listParticipants}
        groupId={props.groupId}
      />
      {isOpenModalLeaveGroup && (
        <ModalLeaveGroup
          isOpen={isOpenModalLeaveGroup}
          groupId={props.groupId}
          title="Rời khỏi nhóm"
          onOk={() => {
            setIsOpenModalLeaveGroup(false);
            props.setIsOpen(false);
          }}
          onCancel={() => setIsOpenModalLeaveGroup(false)}
        />
      )}
      {isOpenModalUpdateInfoGroup && (
        <ModalUpdateInfoGroup
          isOpen={isOpenModalUpdateInfoGroup}
          onCancel={() => {
            setIsOpenModalUpdateInfoGroup(false);
          }}
          infoGroup={chatGroupDetail?.data?.data}
          title="Thông tin nhóm"
          onOk={() => {
            setIsOpenModalUpdateInfoGroup(false);
          }}
        />
      )}

      {infoUserInGroup?.role === EnumRoleParticipants.ADMIN ||
        (infoUserInGroup?.role === EnumRoleParticipants.CREATOR && (
          <SubMenuMembersApproval
            isOpen={isOpenSubMenuMembersApproval}
            setIsOpen={setIsOpenSubMenuMembersApproval}
            groupId={props.groupId}
          />
        ))}
    </>
  );
};

export default MenuGroupChat;
export { MenuGroupChat, type TypeMenuChatProps };
