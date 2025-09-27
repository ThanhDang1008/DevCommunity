import type { TypeMessageContent } from "@modules/chat/schemes/GroupMessages.model";
import type { IGroupMessages } from "@modules/chat/schemes/GroupMessages.model";

export interface ISendGroupMessage {
  groupConversationId: string; // ID của cuộc trò chuyện nhóm
  senderId: string; // ID của người gửi tin nhắn
  type: IGroupMessages["type"]; // Loại tin nhắn, có thể là văn bản, phương tiện, vị trí hoặc sticker
  content: IGroupMessages["content"]; // Nội dung tin nhắn, bao gồm văn bản, phương tiện, vị trí hoặc sticker
  replyToId?: string | null; // ID của tin nhắn được trả lời, null nếu không có
}
