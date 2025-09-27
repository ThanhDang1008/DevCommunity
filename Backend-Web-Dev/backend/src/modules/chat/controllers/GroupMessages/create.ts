import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import {
  ServerError,
  BadRequestError,
} from "@/shared/globals/exceptions/error-handler";
import { Role } from "@/constants/common";
import { socketIOChatObject } from "@modules/chat/events/chatEvents";
import { ChatEvent } from "@modules/chat/constants/common";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

import { groupMessagesService } from "@modules/chat/services/GroupMessages/GroupMessages.service";
import { groupConversationsService } from "@modules/chat/services/GroupConversations/GroupConversations.service";
import type { IGroupMessages } from "../../schemes/GroupMessages.model";

export class CreateGroupMessages {
  public async send(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      {
        UUID: string; // UUID of the user sending the message
        groupId: string;
        content: IGroupMessages["content"];
        type: IGroupMessages["type"];
        replyToId?: string | null; // Optional field for replying to a message
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    const { groupId, content, type, replyToId, UUID } = req.body;

    const missingFields = [];
    if (!groupId) missingFields.push("groupId");
    if (!content) missingFields.push("content");
    if (!UUID) missingFields.push("UUID");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter"),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const listFileKey = (content?.media?.fileId as string[]) || [];
      if (listFileKey.length > 0) {
        groupConversationsService
          .addListFileId({
            groupId: groupId,
            listFileKey: listFileKey,
          })
          .catch((error) => {
            logError(
              "add-list-file-id-group-conversation",
              "Add list file ID to group conversation failed",
              error
            );
          });
      }

      const newMessage = await groupMessagesService
        .create({
          groupConversationId: groupId,
          senderId: session.id_user,
          content: content,
          type: type,
          replyToId: replyToId || null, // Optional field for replying to a message
        })
        .catch((error) => {
          logError(
            "create-group-messages",
            "Create group messages failed",
            error
          );
          return next(parseMongoError(error));
        });

      if (!newMessage) {
        return next(
          new ServerError(
            req.t("modules.chat.group-messages.send.error"),
            "CREATE_GROUP_MESSAGE_FAIL"
          )
        );
      }

      
      // console.log("New group message created:", newMessage);
      //       New group message created: {
      //   groupConversationId: new ObjectId('68433c43406f540c19ee0971'),
      //   senderId: new ObjectId('68287213fe5b2c6fc885d88b'),
      //   content: {
      //     text: 'hé lô 6667',
      //     mentions: [],
      //     media: { fileId: [] },
      //     sticker: null
      //   },
      //   isDeleted: false,
      //   isEdited: false,
      //   isPinned: false,
      //   editedAt: null,
      //   pinnedAt: null,
      //   pinnedBy: null,
      //   readBy: [],
      //   _id: new ObjectId('6843df0786e05f8960c73dc2'),
      //   createdAt: 2025-06-07T06:41:11.790Z,
      //   reactions: [],
      //   __v: 0
      // }

      // Update the last message in the group conversation
      const updatedGroup = await groupConversationsService
        .updateLastMessage(groupId, newMessage._id)
        .catch((error) => {
          logError(
            "update-last-message-group-conversation",
            "Update last message in group conversation failed",
            error
          );
          return next(parseMongoError(error));
        });

      // // Tìm lastReadAt của userId trong participants
      // const participant = updatedGroup?.participants.find(
      //   (p) => p.userId?.toString() === session.id_user
      // );
      // const lastReadAt = participant?.lastReadAt;

      // const unreadCount = await groupMessagesService.unreadCountsMessages(
      //   groupId,
      //   session.id_user,
      //   lastReadAt
      // );
      // console.log("unreadCount:", unreadCount);
      // socketIOChatObject.emit(
      //   `${ChatEvent.CHAT_GROUP_UNREAD_COUNT}_${groupId}_${session.id_user}`,
      //   {
      //     unreadCount: unreadCount,
      //   }
      // );

      //console.log("updatedGroup:", updatedGroup);

      socketIOChatObject
        .to(groupId)
        .emit(`${ChatEvent.CHAT_GROUP_LAST_MESSAGE}`, {
          groupId: groupId,
          lastMessageId: {
            UUID: UUID,
            ...updatedGroup?.lastMessageId.toObject(),
          },
        });

        
      // Emit the new message to the group
      socketIOChatObject
        .to(groupId)
        .emit(`${ChatEvent.CHAT_GROUP_MESSAGE}_${groupId}`, {
          groupId: groupId,
          message: {
            UUID: UUID,
            ...updatedGroup?.lastMessageId.toObject(),
          },
        });

      return res.status(201).json({
        message: req.t("modules.chat.group-messages.send.success"),
        data: newMessage,
      });
    } catch (error) {
      logError("create-group-messages", "Create group messages failed", error);
      return next(
        new ServerError(req.t("modules.chat.group-messages.send.error"))
      );
    }
  }
}
