import mongoose, { Schema, Document } from "mongoose";
import type { IUser } from "@/modules/user/schemes/user.model";

interface IReaction {
  emoji: string; // Biểu tượng cảm xúc của phản ứng
  users: Schema.Types.ObjectId[]; // Danh sách người dùng đã phản ứng với biểu tượng cảm xúc này
}

export type TypeMessageContent = "text" | "media" | "location" | "sticker";

export interface IGroupMessages extends Document {
  _id: string; // ID của tin nhắn
  groupConversationId: Schema.Types.ObjectId; // Tham chiếu đến cuộc trò chuyện nhóm (groupConversationId)
  senderId: IUser; // Tham chiếu đến người gửi tin nhắn (senderId)
  type: TypeMessageContent[]; // Loại tin nhắn, có thể là văn bản, phương tiện, vị trí hoặc sticker
  // Nội dung tin nhắn
  content: {
    text: String; // Nội dung tin nhắn,
    mentions: {
      userId: Schema.Types.ObjectId;
      offset: Number; // vị trí trong text
      length: Number; // độ dài username
    }[]; // Danh sách người dùng được đề cập trong tin nhắn
    media: {
      fileId: Schema.Types.ObjectId[] | string[]; // Tham chiếu đến tệp đính kèm (ảnh, video, tài liệu, v.v.)
    };
    location?: {
      latitude: Number;
      longitude: Number;
    };
    sticker?: String;
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

const GroupMessagesSchema: Schema = new Schema<IGroupMessages>({
  groupConversationId: {
    type: Schema.Types.ObjectId,
    ref: "GroupConversations",
    required: true,
  },
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: [String],
    enum: ["text", "media", "location", "sticker"],
    default: ["text"], // Mặc định là tin nhắn văn bản
  },

  content: {
    // Nội dung tin nhắn
    text: { type: String, default: "" }, // Nội dung tin nhắn, có thể là văn bản, ảnh, video, v.v.
    mentions: {
      type: [
        {
          userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
          offset: { type: Number },
          length: { type: Number },
        },
      ],
      default: [],
    },
    media: {
      fileId: {
        type: [{ type: String, required: true }], // Store S3 keys or filenames as strings
        default: [],
      },
    },
    //foreignField: "key",
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    sticker: { type: String, default: null },
  },

  isDeleted: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },

  editedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  pinnedAt: { type: Date, default: null },

  pinnedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

  replyToId: {
    type: Schema.Types.ObjectId,
    ref: "GroupMessages",
    default: null,
  },

  readBy: {
    type: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    default: [],
  }, // Danh sách người dùng đã đọc tin nhắn

  reactions: {
    type: [
      {
        emoji: { type: String, required: true },
        users: [{ type: Schema.Types.ObjectId, ref: "User", require: true }], // Danh sách người dùng đã phản ứng với biểu tượng cảm xúc này
      },
    ],
    default: [],
  },
  isSent: { type: Boolean, default: true }, // Trạng thái đã gửi tin nhắn
});

export default mongoose.model<IGroupMessages>(
  "GroupMessages",
  GroupMessagesSchema
);
