import mongoose, { Schema, Document } from "mongoose";

export type TypeRequestType = "JOIN" | "INVITE";
export type TypeReviewStatus = "APPROVED" | "REJECTED" | "PENDING";

export interface IGroupJoinRequests extends Document {
  _id: string; // ID duy nhất của yêu cầu
  groupConversationId: Schema.Types.ObjectId; // Tham chiếu đến cuộc trò chuyện nhóm (groupConversationId)
  userId: Schema.Types.ObjectId; // Người dùng gửi yêu cầu tham gia nhóm
  requestType: TypeRequestType; // "join" hoặc "invite"
  requestMessage: String; // Lời nhắn khi xin vào nhóm
  invitedBy: Schema.Types.ObjectId | null; // Người mời (nếu có), null nếu không có

  // Thông tin xem xét
  reviewedBy: Schema.Types.ObjectId | null; // Người quản trị đã xem xét yêu cầu, null nếu chưa được xem xét
  reviewedAt: string | Date | null; // Ngày xem xét yêu cầu, null nếu chưa được xem xét
  reviewStatus: TypeReviewStatus; // Trạng thái xem xét: "approved", "rejected", null nếu chưa được xem xét

  expiresAt: string | Date;
  createdAt: string | Date; // Ngày tạo yêu cầu
}

const GroupJoinRequestsSchema: Schema = new Schema<IGroupJoinRequests>({
  groupConversationId: {
    type: Schema.Types.ObjectId,
    ref: "GroupConversations",
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  requestType: {
    type: String,
    enum: ["JOIN", "INVITE"],
    required: true,
  },
  requestMessage: { type: String, default: "" },
  invitedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

  reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  reviewedAt: { type: Date, default: null },
  reviewStatus: {
    type: String,
    enum: ["APPROVED", "REJECTED", "PENDING"],
    default: "PENDING",
  },

  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // Mặc định là 7 ngày kể từ khi tạo
  },
  createdAt: { type: Date, default: Date.now },
});

//index cho field expiresAt tự động xóa sau 7 ngày
GroupJoinRequestsSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 }
); // Tự động xóa sau 7 ngày

GroupJoinRequestsSchema.index(
  { userId: 1, groupConversationId: 1 },
  { unique: true }
); // Đảm bảo mỗi người dùng chỉ có một yêu cầu cho mỗi nhóm

export default mongoose.model<IGroupJoinRequests>(
  "GroupJoinRequests",
  GroupJoinRequestsSchema
);

