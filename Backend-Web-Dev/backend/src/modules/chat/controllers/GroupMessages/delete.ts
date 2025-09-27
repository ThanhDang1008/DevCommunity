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

export class DeleteGroupMessages {
  public async deleteMessage(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    const { groupId, messageId, isDeleted } = req.body;
    const missingFields = [];
    if (isDeleted === null || isDeleted === undefined)
      missingFields.push("isDeleted");
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

    try {
      const deletedMessage = await groupMessagesService
        .deleteMessageById({
          messageId: messageId,
          senderId: session.id_user,
          isDeleted: typeof isDeleted === "boolean" ? isDeleted : false,
        })
        .catch((error) => {
          logError(
            "delete-group-messages",
            "Delete group messages failed",
            error
          );
          return next(parseMongoError(error));
        });

      if (!deletedMessage) {
        return next(
          new ServerError(
            req.t("modules.chat.group-messages.delete.error"),
            "DELETE_GROUP_MESSAGE_FAIL"
          )
        );
      }

      // Emit event to notify the group about the deleted message
      socketIOChatObject
        .to(groupId)
        .emit(`${ChatEvent.CHAT_GROUP_MESSAGE_DELETED}_${groupId}`, {
          groupId: groupId,
          messageId: messageId,
          isDeleted: isDeleted,
          userId: session.id_user,
        });

      return res.status(200).json({
        message: req.t("modules.chat.group-messages.delete.success"),
      });
    } catch (error) {
      logError("delete-group-messages", "Delete group messages failed", error);
      return next(
        new ServerError(req.t("modules.chat.group-messages.delete.error"))
      );
    }
  }
}
