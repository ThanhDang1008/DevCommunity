import type { TypeRequestType } from "@modules/chat/schemes/GroupJoinRequests.model";

export type TypeCreateGroupJoinRequest = {
  groupConversationId: string; // ID của cuộc trò chuyện nhóm
  userId: string; // ID của người dùng gửi yêu cầu
  requestType: TypeRequestType; // Loại yêu cầu: "join" hoặc "invite"
  requestMessage?: string; // Lời nhắn khi xin vào nhóm, có thể để trống
  invitedBy?: string | null; // ID của người mời, có thể để trống nếu không có
};
