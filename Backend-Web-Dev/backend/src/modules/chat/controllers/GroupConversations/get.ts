import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import {
  ServerError,
  BadRequestError,
} from "@/shared/globals/exceptions/error-handler";
import { Role } from "@/constants/common";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

import { groupConversationsService } from "@modules/chat/services/GroupConversations/GroupConversations.service";

export class GetGroupConversations {
  public async handle(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    try {
      let groupConversations;
      // if (session?.id_role?.role === Role.ROOT) {
      //   groupConversations = await groupConversationsService
      //     .getAllByRoot()
      //     .catch((error) => {
      //       logError(
      //         "get-group-conversations",
      //         "Get group conversations failed",
      //         error
      //       );
      //       return next(
      //         new ServerError(
      //           req.t("modules.chat.group-conversations.get-all.error")
      //         )
      //       );
      //     });
      // }

      // if (session?.id_role?.role !== Role.ROOT) {
      groupConversations = await groupConversationsService
        .getAllByUserId(session.id_user)
        .catch((error) => {
          logError(
            "get-group-conversations",
            "Get group conversations failed",
            error
          );
          return next(parseMongoError(error));
        });
      // }

      if (!groupConversations) {
        return next(
          new ServerError(
            req.t("modules.chat.group-conversations.get-all.error"),
            "GET_GROUP_CONVERSATIONS_FAIL"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.chat.group-conversations.get-all.success"),
        data: groupConversations,
      });
    } catch (error) {
      logError(
        "get-group-conversations",
        "Get group conversations fail",
        error
      );
      return next(
        new ServerError(req.t("server.error"), "INTERNAL_SERVER_ERROR")
      );
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    const { groupId } = req.params;
    const missingFields = [];
    if (!groupId) missingFields.push("groupId");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const groupConversation = await groupConversationsService
        .getDetailById(groupId)
        .catch((error) => {
          logError(
            "get-group-conversation-by-id",
            "Get group conversation by id failed",
            error
          );
          return next(parseMongoError(error));
        });

      if (!groupConversation) {
        return next(
          new ServerError(
            req.t("modules.chat.group-conversations.get-by-id.error"),
            "GET_GROUP_CONVERSATION_BY_ID_FAIL"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.chat.group-conversations.get-by-id.success"),
        data: groupConversation,
      });
    } catch (error) {
      logError(
        "get-group-conversation-by-id",
        "Get group conversation by id failed",
        error
      );
      return next(
        new ServerError(req.t("server.error"), "INTERNAL_SERVER_ERROR")
      );
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const groupConversations = await groupConversationsService
        .getAll()
        .catch((error) => {
          logError(
            "get-group-conversations",
            "Get all group conversations failed",
            error
          );
          return next(parseMongoError(error));
        });

      if (!groupConversations) {
        return next(
          new ServerError(
            req.t("modules.chat.group-conversations.get.all.error"),
            "GET_GROUP_CONVERSATIONS_FAIL"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.chat.group-conversations.get.all.success"),
        data: groupConversations,
      });
    } catch (error) {
      logError(
        "get-group-conversations",
        "Get group conversations failed",
        error
      );
      return next(
        new ServerError(req.t("modules.chat.group-conversations.get.all.error"))
      );
    }
  }
}
