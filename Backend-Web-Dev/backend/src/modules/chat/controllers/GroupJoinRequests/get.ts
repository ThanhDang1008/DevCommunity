import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import {
  ServerError,
  BadRequestError,
} from "@/shared/globals/exceptions/error-handler";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";
import type { TypeReviewStatus } from "@modules/chat/schemes/GroupJoinRequests.model";

import { groupJoinRequestsService } from "@modules/chat/services/GroupJoinRequests/GroupJoinRequests.service";
import { groupConversationsService } from "@modules/chat/services/GroupConversations/GroupConversations.service";

export class GetGroupJoinRequests {
  public async getAll(
    req: Request<{
      groupId: string;
    }>,
    res: Response,
    next: NextFunction
  ) {
    const { groupId } = req.params;

    try {
      // Fetch all join requests for the group
      const joinRequests = await groupJoinRequestsService
        .getAllJoinRequestsByGroupId(groupId)
        .catch((error) => {
          logError("get", "Get group join requests failed", error);
          return next(
            parseMongoError(
              error,
              req.t("modules.chat.group-join-requests.get.all.error")
            )
          );
        });

      if (!joinRequests) {
        return next(
          new BadRequestError(
            req.t("modules.chat.group-join-requests.get.all.error"),
            "GROUP_JOIN_REQUEST_NOT_FOUND"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.chat.group-join-requests.get.all.success"),
        data: joinRequests,
      });
    } catch (error) {
      logError("get", "Get group join requests error", error);
      return next(
        new ServerError(req.t("modules.chat.group-join-requests.get.all.error"))
      );
    }
  }
}
