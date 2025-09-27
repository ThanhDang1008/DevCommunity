import mongoose, { Schema, Document } from "mongoose";
import type { IGroupMessages } from "./GroupMessages.model";
import type { IUser } from "@/modules/user/schemes/user.model";
import type { IGroupJoinRequests } from "./GroupJoinRequests.model";
import type { IS3 } from "@/modules/s3/schemes/s3.model";

type RoleParticipants = "CREATOR" | "ADMIN" | "MEMBER";
export enum enumRoleParticipant {
  CREATOR = "CREATOR",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}
export enum enumPermissionsParticipant {
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
  [key in enumPermissionsParticipant]: boolean;
};

interface IParticipants {
  userId: IUser; // Tham chiếu đến User
  role?: RoleParticipants; // Vai trò của người dùng trong nhóm (chỉ trưởng nhóm và phó nhóm)
  nickname?: string; // Biệt danh của người dùng trong nhóm
  joinedAt?: string | Date; // Ngày tham gia nhóm
  invitedBy?: IUser; // Người đã mời tham gia nhóm

  lastReadAt?: string | Date | null; // Ngày đọc tin nhắn cuối cùng, null nếu chưa đọc
  lastReadMessageId?: string | null; // Tham chiếu đến tin nhắn cuối cùng đã đọc, null nếu chưa đọc
  //     const unreadCount = await GroupMessages.countDocuments({
  //   groupConversationId,
  //   createdAt: { $gt: lastReadAt },
  //   senderId: { $ne: userId }, // Không tính tin nhắn của chính mình
  // });
  isPinned?: boolean; // true nếu người dùng đã ghim nhóm, false nếu không

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
  notification?: {
    is_muted: boolean; // true nếu tắt tiếng, false nếu không
    mute_until: string | Date | null; // Thời gian tắt tiếng, null nếu không tắt tiếng
  };
}

export interface IGroupConversations extends Document {
  _id: string;
  title: string; // Tiêu đề nhóm
  description: string; // Mô tả nhóm
  avatar: string; // URL của ảnh đại diện nhóm
  topics: string[]; // Danh sách chủ đề của nhóm

  createdBy: IUser; // Người tạo nhóm, tham chiếu đến User
  createdAt: string | Date; // Ngày tạo nhóm
  updatedAt: string | Date; // Ngày cập nhật nhóm

  participants: IParticipants[];
  groupJoinRequestsId: IGroupJoinRequests[]; // Tham chiếu đến yêu cầu tham gia nhóm (nếu có)
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

  listFileKey: IS3[]; // Danh sách các tệp đính kèm trong nhóm, tham chiếu đến S3
  lastMessageId: IGroupMessages; // Tham chiếu đến tin nhắn cuối cùng trong nhóm
  //field add
  unreadCount: number; // Số lượng tin nhắn chưa đọc của người dùng trong nhóm
}

const GroupConversationsSchema: Schema = new Schema<IGroupConversations>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  avatar: { type: String, default: "" },
  topics: { type: [String], default: [] },

  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  groupJoinRequestsId: [
    { type: Schema.Types.ObjectId, ref: "GroupJoinRequests", default: [] },
  ],

  participants: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      role: {
        type: String,
        enum: ["CREATOR", "ADMIN", "MEMBER"],
        default: "MEMBER",
      },
      isPinned: { type: Boolean, default: false },
      nickname: { type: String, default: "" },
      joinedAt: { type: Date, default: Date.now },
      invitedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

      lastReadAt: { type: Date, default: null },
      lastReadMessageId: { type: String, default: null },

      permissions: {
        can_send_messages: { type: Boolean, default: true },
        can_send_media: { type: Boolean, default: true },
        can_send_polls: { type: Boolean, default: true },
        can_change_info: { type: Boolean, default: false },
        can_invite_users: { type: Boolean, default: false },
        can_pin_messages: { type: Boolean, default: false },
        can_delete_messages: { type: Boolean, default: false },
        can_kick_users: { type: Boolean, default: false },
        can_restrict_members: { type: Boolean, default: false },
        can_promote_members: { type: Boolean, default: false },
      },

      notification: {
        is_muted: { type: Boolean, default: false }, // true nếu tắt tiếng, false nếu không
        mute_until: { type: String, default: null }, // Thời gian tắt tiếng, null nếu không tắt tiếng
      },
    },
  ],
  listFileKey: [{ type: [String], ref: "S3", default: [] }],
  settings: {
    isPublic: { type: Boolean, default: true },
    joinQuestions: {
      type: [String],
      default: [],
    },
    historyVisibleToNewMembers: { type: Boolean, default: true },
    inviteLink: { type: String, default: null },
    inviteLinkExpires: { type: String, default: null },
    maxMembers: { type: Number, default: 1000 },

    defaultPermissions: {
      can_send_messages: { type: Boolean, default: true },
      can_send_media: { type: Boolean, default: true },
      can_send_polls: { type: Boolean, default: true },
      can_change_info: { type: Boolean, default: false },
      can_invite_users: { type: Boolean, default: false },
      can_pin_messages: { type: Boolean, default: false },
      can_delete_messages: { type: Boolean, default: false },
      can_kick_users: { type: Boolean, default: false },
      can_restrict_members: { type: Boolean, default: false },
      can_promote_members: { type: Boolean, default: false },
    },
  },
  lastMessageId: {
    type: Schema.Types.ObjectId,
    ref: "GroupMessages",
    default: null,
  },
});

export default mongoose.model<IGroupConversations>(
  "GroupConversations",
  GroupConversationsSchema
);
