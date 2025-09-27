export type TypeRequestType = "JOIN" | "INVITE";
export type TypeReviewStatus = "APPROVED" | "REJECTED" | "PENDING";
import type { IGroupConversations } from "./GroupConversations";
import type { IUser } from "@/service/api/user/types";

export interface IGroupJoinRequests {
  _id: string; // ID duy nhất của yêu cầu
  groupConversationId: IGroupConversations; // Tham chiếu đến cuộc trò chuyện nhóm (groupConversationId)
  userId: IUser; // Người dùng gửi yêu cầu tham gia nhóm
  requestType: TypeRequestType; // "join" hoặc "invite"
  requestMessage: String; // Lời nhắn khi xin vào nhóm
  invitedBy: IUser | null; // Người mời (nếu có), null nếu không có

  // Thông tin xem xét
  reviewedBy: IUser | null; // Người quản trị đã xem xét yêu cầu, null nếu chưa được xem xét
  reviewedAt: string | Date | null; // Ngày xem xét yêu cầu, null nếu chưa được xem xét
  reviewStatus: TypeReviewStatus; // Trạng thái xem xét: "approved", "rejected", null nếu chưa được xem xét

  expiresAt: string | Date;
  createdAt: string | Date; // Ngày tạo yêu cầu
}

export type TypeGetGroupJoinRequestsResponse = {
  message: string;
  data: IGroupJoinRequests[];
};

export type TypeFeedbackGroupJoinRequest = {
  groupJoinRequestId: string;
  groupId: string;
  action: TypeReviewStatus;
};
