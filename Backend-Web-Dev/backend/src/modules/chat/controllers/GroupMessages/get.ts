import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import {
  ServerError,
  BadRequestError,
} from "@/shared/globals/exceptions/error-handler";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

import { groupMessagesService } from "@modules/chat/services/GroupMessages/GroupMessages.service";

export class GetGroupMessages {
  public async handle(req: Request, res: Response, next: NextFunction) {
    const { groupId } = req.params;
    const { page, limit } = req.query;
    const missingFields = [];
    if (!groupId) missingFields.push("groupId");
    if (!page) missingFields.push("page");
    if (!limit) missingFields.push("limit");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 100 ? parseInt(limit as string) : 100;
    try {
      const groupMessages = await groupMessagesService
        .getAllByGroupId({
          groupConversationId: groupId,
          page: _page,
          limit: _limit,
        })
        .catch((error) => {
          logError("get-group-messages", "Get group messages failed", error);
          return next(parseMongoError(error));
        });

      if (!groupMessages) {
        return next(
          new ServerError(
            req.t("modules.chat.group-messages.get-all.error"),
            "GET_GROUP_MESSAGES_FAIL"
          )
        );
      }

      const totalMessages = await groupMessagesService
        .countMessagesByGroupId(groupId)
        .catch((error) => {
          logError("get-group-messages", "Count group messages failed", error);
          return next(parseMongoError(error));
        });

      const totalPages = Math.ceil(Number(totalMessages) / _limit);

      return res.status(200).json({
        message: req.t("modules.chat.group-messages.get-all.success"),
        data: groupMessages,
        currentPage: _page,
        totalPages: totalPages,
        totalMessages: totalMessages,
      });
    } catch (error) {
      logError("get-group-messages", "Get group messages failed", error);
      return next(
        new ServerError(req.t("modules.chat.group-messages.get-all.error"))
      );
    }
  }
}
