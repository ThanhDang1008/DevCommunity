import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import {
  ServerError,
  BadRequestError,
} from "@/shared/globals/exceptions/error-handler";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";
import { groupConversationsService } from "@modules/chat/services/GroupConversations/GroupConversations.service";

export class CreateGroupConversations {
  public async handle(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;
    const { title, members, topics, isPublic } = req.body;

    try {
      const groupConversation = await groupConversationsService
        .create({
          title: title,
          userId: session.id_user,
          createdBy: session.id_user,
          members: members,
          topics: topics,
          isPublic: isPublic,
        })
        .catch((error) => {
          logError(
            "create-group-conversation",
            "Create group conversation failed",
            error
          );
          return next(parseMongoError(error));
        });

      if (!groupConversation) {
        return next(
          new ServerError(
            req.t("modules.chat.group-conversations.create.handle.error"),
            "CREATE_GROUP_CONVERSATION_FAIL"
          )
        );
      }

      return res.status(201).json({
        message: req.t(
          "modules.chat.group-conversations.create.handle.success"
        ),
        data: groupConversation,
      });
    } catch (error) {
      logError("create", "Create group conversation failed", error);
      return next(
        new ServerError(
          req.t("modules.chat.group-conversations.create.handle.error")
        )
      );
    }
  }
}
