import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import {
  ServerError,
  BadRequestError,
  ConflictError,
} from "@/shared/globals/exceptions/error-handler";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

import { groupJoinRequestsService } from "@modules/chat/services/GroupJoinRequests/GroupJoinRequests.service";
import { groupConversationsService } from "@modules/chat/services/GroupConversations/GroupConversations.service";

export class CreateGroupJoinRequests {
  public async join(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;
    const { groupId, requestType, requestMessage, invitedBy } = req.body;
    try {
      const groupJoinRequest = await groupJoinRequestsService
        .create({
          groupConversationId: groupId,
          userId: session.id_user,
          requestType: requestType,
          requestMessage: requestMessage || "",
          invitedBy: invitedBy || null,
        })
        .catch((error) => {
          logError("create", "Create group join request failed", error);
          return next(parseMongoError(error));
        });
      //console.log("groupJoinRequest", groupJoinRequest);

      if (!groupJoinRequest) {
        return next(
          new ServerError(
            req.t("modules.chat.group-join-requests.create.join.error"),
            "CREATE_GROUP_JOIN_REQUEST_FAIL"
          )
        );
      }

      const joinGroupConversation = await groupConversationsService
        .updateJoinRequest({
          groupJoinRequestId: groupJoinRequest._id,
          groupId: groupId,
          type: "add",
        })
        .catch((error) => {
          logError(
            "create",
            "Update group conversation join request failed",
            error
          );
          return next(parseMongoError(error));
        });

      //console.log("joinGroupConversation", joinGroupConversation);

      if (!joinGroupConversation) {
        return next(
          new ServerError(
            req.t("modules.chat.group-join-requests.create.join.error"),
            "UPDATE_GROUP_CONVERSATION_JOIN_REQUEST_FAIL"
          )
        );
      }

      return res.status(201).json({
        message: req.t("modules.chat.group-join-requests.create.join.success"),
        //data: groupJoinRequest,
      });
    } catch (error) {
      logError("create", "Create group join request failed", error);
      return next(
        new ServerError(
          req.t("modules.chat.group-join-requests.create.join.error")
        )
      );
    }
  }
}
