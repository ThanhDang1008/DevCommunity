import GroupMessages, {
  IGroupMessages,
} from "../../schemes/GroupMessages.model";

import type { ISendGroupMessage } from "@modules/chat/interfaces/GroupMessages";

class GroupMessagesService {
  public async create(data: ISendGroupMessage): Promise<IGroupMessages | null> {
    try {
      const newMessage = await GroupMessages.create({
        groupConversationId: data.groupConversationId,
        senderId: data.senderId,
        content: {
          text: data.content.text || "", // Tin nhắn văn bản
          media: {
            fileId: data.content.media?.fileId || [], // Mảng ID của các file đính kèm
          },
        },
        type: data.type ? data.type : ["text"], // Mặc định là tin nhắn văn bản
        replyToId: data.replyToId || null, // ID của tin nhắn được trả lời, nếu có
      });

      return newMessage;
    } catch (error) {
      throw error;
    }
  }

  public async unreadCountsMessages(
    groupConversationId: string,
    userId: string,
    lastReadAt: string | Date | null = null
  ): Promise<number> {
    try {
      const count = await GroupMessages.countDocuments({
        groupConversationId: groupConversationId,
        senderId: { $ne: userId }, // không tính tin nhắn của chính người dùng
        ...(lastReadAt ? { createdAt: { $gt: new Date(lastReadAt) } } : {}), // nếu chưa từng đọc thì lấy hết
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async getAllByGroupId({
    groupConversationId,
    userId,
    page,
    limit,
  }: {
    groupConversationId: string; // ID của cuộc trò chuyện nhóm
    userId?: string; // ID của người dùng (nếu cần để lọc tin nhắn)
    page: number; // Số trang, mặc định là 1
    limit: number; // Số lượng tin nhắn mỗi trang, mặc định là 20
  }): Promise<any> {
    try {
      const messages = await GroupMessages.find({
        groupConversationId: groupConversationId,
      })
        .populate("senderId", "fullname avatar email") // Populate thông tin người gửi
        .populate({
          path: "content.media.fileId",
          model: "S3", // Model chứa thông tin file đính kèm
          foreignField: "key",
          select: "-author", // Chọn các trường cần thiết
        }) // Populate file đính kèm nếu có
        .populate({
          path: "replyToId",
          populate: {
            path: "senderId",
            select: "fullname avatar email",
          },
        }) // Nếu có trả lời thì populate người gửi trong tin nhắn gốc
        .populate("readBy", "_id fullname email avatar")
        .sort({ createdAt: -1 }) // Mới nhất trước
        .skip((page - 1) * limit) // Bỏ qua số lượng tin nhắn đã lấy
        .limit(limit) // Giới hạn số lượng tin nhắn lấy
        .lean(); // Chuyển sang plain object (tốt cho frontend)

      return messages;
    } catch (error) {
      throw error;
    }
  }

  public async countMessagesByGroupId(
    groupConversationId: string
  ): Promise<number> {
    try {
      const count = await GroupMessages.countDocuments({
        groupConversationId: groupConversationId,
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async readMessagesById({
    groupConversationId,
    userId,
    messageId,
  }: {
    groupConversationId: string; // ID của cuộc trò chuyện nhóm
    userId: string; // ID của người dùng muốn đánh dấu tin nhắn là đã đọc
    messageId: string; // ID của tin nhắn cụ thể
  }): Promise<IGroupMessages | null> {
    try {
      const result = await GroupMessages.findOneAndUpdate(
        {
          _id: messageId,
          groupConversationId,
          senderId: { $ne: userId }, // không tự đọc tin nhắn của mình
          readBy: { $ne: userId }, // chỉ đánh dấu nếu chưa đọc
        },
        {
          $addToSet: { readBy: userId },
        },
        {
          new: true, // Trả về tài liệu đã cập nhật
        }
      )
        .populate("readBy", "_id fullname email avatar") // Populate ngay tại đây
        .exec();
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async deleteMessageById(data: {
    messageId: string; // ID của tin nhắn cần xóa
    senderId: string; // ID của người gửi tin nhắn
    isDeleted:boolean; // Đánh dấu tin nhắn là đã xóa
  }): Promise<IGroupMessages | null> {
    try {
      const deletedMessage = await GroupMessages.findOneAndUpdate(
        {
          _id: data.messageId,
          senderId: data.senderId, // Chỉ cho phép người gửi xóa tin nhắn của mình
        },
        {
          isDeleted: data.isDeleted, // Đánh dấu tin nhắn là đã xóa
        },
        {
          new: true, // Trả về tài liệu đã cập nhật
        }
      );

      return deletedMessage;
    } catch (error) {
      throw error;
    }
  }
}

export const groupMessagesService: GroupMessagesService =
  new GroupMessagesService();
