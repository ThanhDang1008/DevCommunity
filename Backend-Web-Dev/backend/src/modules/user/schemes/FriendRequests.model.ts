import mongoose, { Schema, Document } from "mongoose";

export type TypeFriendRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export enum EnumFriendRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface IFriendRequests extends Document {
  _id: string; // ID của yêu cầu kết bạn
  senderId: Schema.Types.ObjectId; // ID người gửi yêu cầu kết bạn
  receiverId: Schema.Types.ObjectId; // ID người nhận yêu cầu kết bạn
  message?: string; // Tin nhắn kèm theo yêu cầu kết bạn (tùy chọn)
  status: TypeFriendRequestStatus; // Trạng thái của yêu cầu kết bạn
  createdAt: Date; // Ngày tạo yêu cầu kết bạn
  updatedAt: Date; // Ngày cập nhật yêu cầu kết bạn
}

const FriendRequestsSchema: Schema = new Schema<IFriendRequests>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, default: "" }, // Tin nhắn kèm theo yêu cầu kết bạn
    status: {
      type: String,
      enum: [
        EnumFriendRequestStatus.PENDING,
        EnumFriendRequestStatus.ACCEPTED,
        EnumFriendRequestStatus.REJECTED,
      ],
      default: EnumFriendRequestStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFriendRequests>(
  "FriendRequests",
  FriendRequestsSchema
);
