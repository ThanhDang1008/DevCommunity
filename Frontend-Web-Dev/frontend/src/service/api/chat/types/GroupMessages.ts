import type { IUser } from "@/service/api/user/types";
import type { IFile } from "@/service/api/file/types";
import type { IGroupConversations } from "./GroupConversations";

interface IReaction {
  emoji: string; // Biểu tượng cảm xúc của phản ứng
  users: IUser[]; // Danh sách người dùng đã phản ứng với biểu tượng cảm xúc này
}

type TypeMessageContent = "text" | "media" | "location" | "sticker";

export interface IGroupMessages {
  _id: string; // ID của tin nhắn
  UUID: string; // UUID ảo (không lưu ở database) để nhận diện tin nhắn trong quá trình gửi và cập nhật
  groupConversationId: IGroupConversations; // Tham chiếu đến cuộc trò chuyện nhóm (groupConversationId)
  senderId: IUser; // Tham chiếu đến người gửi tin nhắn (senderId)
  type: TypeMessageContent[];
  // Nội dung tin nhắn
  content: {
    text: string; // Nội dung tin nhắn,
    mentions?: {
      userId: IUser;
      offset: Number; // vị trí trong text
      length: Number; // độ dài username
    }[]; // Danh sách người dùng được đề cập trong tin nhắn
    media?: {
      fileId: IFile[]; // Tham chiếu đến tệp đính kèm (ảnh, video, tài liệu, v.v.)
    };
    location?: {
      latitude: Number;
      longitude: Number;
    };
    sticker?: string;
  };
  // Thông tin về tin nhắn trả lời
  replyToId?: IGroupMessages | null; // Tham chiếu đến tin nhắn được trả lời, null nếu không có

  // Trạng thái của tin nhắn
  isDeleted: false; // Trạng thái đã xóa
  isEdited: false; // Trạng thái đã chỉnh sửa
  isPinned: false; // Trạng thái đã ghim

  editedAt: string | Date | null; // Ngày chỉnh sửa tin nhắn, null nếu không có
  createdAt: string | Date; // Ngày tạo tin nhắn
  pinnedAt: string | Date | null; // Ngày ghim tin nhắn, null nếu không có

  pinnedBy: null;

  readBy: IUser[]; // Danh sách người dùng đã đọc tin nhắn
  // Reactions (like Telegram)
  reactions: IReaction[]; // Danh sách các phản ứng của người dùng với tin nhắn,
  isSent: boolean; // Trạng thái đã gửi tin nhắn
}

export type GetGroupMessagesResponse = {
  messages: string;
  data: IGroupMessages[];
  currentPage: number;
  totalPages: number;
  totalMessages: number;
};

export type CreateGroupMessage = {
  UUID: string;
  groupId: string;
  content: IGroupMessages["content"];
  type: IGroupMessages["type"];
  replyToId?: string | null; // ID của tin nhắn được trả lời, nếu có
};
