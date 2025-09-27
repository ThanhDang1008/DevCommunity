import type { IUser } from "@/service/api/user/types";
import type { IGroupMessages } from "./GroupMessages";
import type { IGroupJoinRequests } from "./GroupJoinRequests";
import type { IFile } from "@/service/api/file/types";

export type TypeRoleParticipants = "CREATOR" | "ADMIN" | "MEMBER";

export enum EnumRoleParticipants {
  CREATOR = "CREATOR",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum EnumPermissionsParticipant {
  CAN_SEND_MESSAGES = "can_send_messages",
  CAN_SEND_MEDIA = "can_send_media",
  CAN_SEND_POLLS = "can_send_polls",
  CAN_CHANGE_INFO = "can_change_info",
  CAN_INVITE_USERS = "can_invite_users",
  CAN_PIN_MESSAGES = "can_pin_messages",
  CAN_DELETE_MESSAGES = "can_delete_messages",
  CAN_KICK_USERS = "can_kick_users",
  CAN_RESTRICT_MEMBERS = "can_restrict_members",
  CAN_PROMOTE_MEMBERS = "can_promote_members",
}

export type TypePermissionsParticipant = {
  [key in EnumPermissionsParticipant]: boolean;
};

export interface IParticipants {
  userId: IUser; // Tham chiếu đến User
  role: TypeRoleParticipants; // Vai trò của người dùng trong nhóm (chỉ trưởng nhóm và phó nhóm)
  nickname: string; // Biệt danh của người dùng trong nhóm
  joinedAt: string | Date; // Ngày tham gia nhóm
  invitedBy: IUser; // Người đã mời tham gia nhóm
  lastReadAt: string | Date | null; // Ngày đọc tin nhắn cuối cùng, null nếu chưa đọc
  //     const unreadCount = await GroupMessages.countDocuments({
  //   groupConversationId,
  //   createdAt: { $gt: lastReadAt },
  //   senderId: { $ne: userId }, // Không tính tin nhắn của chính mình
  // });
  isPinned: boolean; // true nếu nhóm được ghim, false nếu không

  // Permissions
  permissions: {
    can_send_messages: boolean; // Có thể gửi tin nhắn
    can_send_media: boolean; // Có thể gửi phương tiện (ảnh, video, tệp)
    can_send_polls: boolean; // Có thể gửi cuộc thăm dò
    can_change_info: boolean; // Có thể thay đổi thông tin nhóm
    can_invite_users: boolean; // Có thể mời người dùng khác vào nhóm
    can_pin_messages: boolean; // Có thể ghim tin nhắn
    can_delete_messages: boolean; // Có thể xóa tin nhắn
    can_kick_users: boolean; // Có thể đá người dùng ra khỏi nhóm
    can_restrict_members: boolean; // Có thể hạn chế quyền của thành viên
    can_promote_members: boolean; // Có thể thăng chức thành viên
  };

  // Cài đặt thông báo
  notification: {
    is_muted: boolean; // true nếu tắt tiếng, false nếu không
    mute_until: string | Date | null; // Thời gian tắt tiếng, null nếu không tắt tiếng
  };
}

export interface IGroupConversations {
  _id: string;
  title: string; // Tiêu đề nhóm
  description: string; // Mô tả nhóm
  avatar: string; // URL của ảnh đại diện nhóm
  topics: string[]; // Danh sách chủ đề của nhóm

  createdBy: IUser; // Người tạo nhóm, tham chiếu đến User
  createdAt: string | Date; // Ngày tạo nhóm
  updatedAt: string | Date; // Ngày cập nhật nhóm

  participants: IParticipants[];
  groupJoinRequestsId: IGroupJoinRequests[];
  listFileKey: IFile[][]; // Danh sách các nhóm tệp đã gửi trong nhóm, mỗi nhóm là một mảng các tệp (IFile[])
  // Cài đặt nhóm
  settings: {
    isPublic: boolean; // true nếu nhóm công khai, false nếu riêng tư
    joinQuestions: string[]; // Danh sách câu hỏi khi tham gia nhóm, có thể để trống nếu không có
    historyVisibleToNewMembers: boolean; // true nếu lịch sử trò chuyện có thể xem được bởi thành viên mới, false nếu không
    inviteLink: string | null; // Liên kết mời tham gia nhóm, null nếu không có
    inviteLinkExpires: Date | null; // Thời gian hết hạn của liên kết mời, null nếu không có
    maxMembers: 1000; // Số lượng tối đa thành viên trong nhóm

    // Quản lý quyền hạn
    defaultPermissions: {
      can_send_messages: boolean; // Có thể gửi tin nhắn
      can_send_media: boolean; // Có thể gửi phương tiện (ảnh, video, tệp)
      can_send_polls: boolean; // Có thể gửi cuộc thăm dò
      can_change_info: boolean; // Có thể thay đổi thông tin nhóm
      can_invite_users: boolean; // Có thể mời người dùng khác vào nhóm
      can_pin_messages: boolean; // Có thể ghim tin nhắn
      can_delete_messages: boolean; // Có thể xóa tin nhắn
      can_kick_users: boolean; // Có thể đá người dùng ra khỏi nhóm
      can_restrict_members: boolean; // Có thể hạn chế quyền của thành viên
      can_promote_members: boolean; // Có thể thăng chức thành viên
    };
  };
  lastMessageId: IGroupMessages; // Tham chiếu đến tin nhắn cuối cùng trong nhóm

  //filed add
  unreadCount: number; // Số lượng tin nhắn chưa đọc trong nhóm
}

export type GroupConversationWithoutDefaultPermissions = Omit<
  IGroupConversations,
  "settings"
> & {
  settings: Omit<IGroupConversations["settings"], "defaultPermissions">;
};

export type GetListGroupConversationsResponse = {
  message: string;
  data: GroupConversationWithoutDefaultPermissions[];
  // totalConversations: number;
  // totalPages: number;
  // data: IGroupConversations[];
};

export type GetGroupConversationsResponse = {
  message: string;
  data: IGroupConversations;
};

export type TypeCreateChatGroup = {
  title: string; // Tiêu đề nhóm
  topics: string[]; // Danh sách chủ đề của nhóm
  isPublic: boolean; // true nếu nhóm công khai, false nếu riêng tư
  members: {
    userId: string; // ID của người dùng tham gia nhóm
  }[]; // Danh sách người dùng tham gia nhóm
};

// Chọn các trường cần thiết trong Participants
type IParticipantSummary = Pick<IParticipants, "userId" | "role">;

// Tùy biến settings để loại bỏ defaultPermissions
type ISettingsSummary = Omit<
  IGroupConversations["settings"],
  "defaultPermissions"
>;

// Type tóm tắt cho group conversation trả về từ API
export type IGroupConversationSummary = Omit<
  IGroupConversations,
  "participants" | "settings"
> & {
  participants: IParticipantSummary[];
  settings: ISettingsSummary;
};

export type GetAllConversationsCommunityResponse = {
  message: string;
  data: IGroupConversationSummary[];
};
