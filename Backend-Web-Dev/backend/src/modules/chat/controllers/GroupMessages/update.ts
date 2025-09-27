import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import {
  ServerError,
  BadRequestError,
} from "@/shared/globals/exceptions/error-handler";
import { socketIOChatObject } from "@modules/chat/events/chatEvents";
import { ChatEvent } from "@modules/chat/constants/common";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

import { groupMessagesService } from "@modules/chat/services/GroupMessages/GroupMessages.service";

export class UpdateGroupMessages {
  public async readByUser(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    const { groupId, messageId } = req.body;
    const missingFields = [];
    if (!groupId) missingFields.push("groupId");
    if (!messageId) missingFields.push("messageId");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    
    //console.log("req.body:", req.body);
    try {
      const updatedMessage = await groupMessagesService
        .readMessagesById({
          groupConversationId: groupId,
          messageId: messageId,
          userId: session.id_user,
        })
        .catch((error) => {
          logError(
            "update-group-messages",
            "Update group messages failed",
            error
          );
          return next(parseMongoError(error));
        });

      //         updatedMessage {
      //   content: {
      //     media: { fileId: [] },
      //     text: 'chào 30',
      //     mentions: [],
      //     sticker: null
      //   },
      //   _id: new ObjectId('68454e8e74b803e9bb2a1a08'),
      //   groupConversationId: new ObjectId('68433c43406f540c19ee0971'),
      //   senderId: new ObjectId('68287213fe5b2c6fc885d88b'),
      //   type: [ 'text' ],
      //   isDeleted: false,
      //   isEdited: false,
      //   isPinned: false,
      //   editedAt: null,
      //   pinnedAt: null,
      //   pinnedBy: null,
      //   replyToId: null,
      //   readBy: [
      //     {
      //       _id: new ObjectId('67fa6cc96a4ce1e9259a0478'),
      //       email: 'minwandev999@gmail.com',
      //       fullname: 'Min Wan',
      //       avatar: 'https://file.minwandev.io.vn/file/MinWan.jpg'
      //     }
      //   ],
      //   createdAt: 2025-06-08T08:49:18.412Z,
      //   reactions: [],
      //   __v: 0
      // }
      //   if (!updatedMessage) {
      //     return next(
      //       new ServerError(
      //         req.t("modules.chat.group-messages.read-by-user.error"),
      //         "UPDATE_GROUP_MESSAGE_FAIL"
      //       )
      //     );
      //   }

      if (updatedMessage) {
        // Emit event to update the message in the group conversation
        socketIOChatObject
          .to(groupId)
          .emit(`${ChatEvent.CHAT_GROUP_MESSAGE_READ}_${groupId}`, {
            groupId: groupId,
            messageId: messageId,
            userId: session.id_user,
            readBy: updatedMessage.readBy, // Danh sách người dùng đã đọc tin nhắn
          });
      }

      return res.status(200).json({
        message: req.t("modules.chat.group-messages.read-by-user.success"),
        //data: updatedMessage,
      });
    } catch (error) {
      logError("update-group-messages", "Update group messages failed", error);
      return next(
        new ServerError(req.t("modules.chat.group-messages.read-by-user.error"))
      );
    }
  }
}
