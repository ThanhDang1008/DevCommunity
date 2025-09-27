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

export class UpdateGroupJoinRequests {
  public async feedback(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      {
        groupJoinRequestId: string;
        groupId: string;
        action: TypeReviewStatus;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;
    const { groupJoinRequestId, groupId, action } = req.body;

    try {
      if (action === "REJECTED") {
        //xoá yêu cầu tham gia nhóm trong group join requests
        const deleteGroupJoinRequest = await groupJoinRequestsService
          .deleteById(groupJoinRequestId)
          .catch((error) => {
            logError("update", "Delete group join request failed", error);
            return next(parseMongoError(error));
          });
        //xoá yêu cầu tham gia nhóm trong group conversation
        const deleteGroupConversationJoinRequest =
          await groupConversationsService
            .deleteJoinRequestsId({
              groupId: groupId,
              groupJoinRequestId: groupJoinRequestId,
            })
            .catch((error) => {
              logError(
                "update",
                "Delete group conversation join request failed",
                error
              );
              return next(parseMongoError(error));
            });

        return res.status(200).json({
          message: req.t(
            "modules.chat.group-join-requests.update.feedback.success"
          ),
        });
      }

      const groupJoinRequest = await groupJoinRequestsService
        .updateStatusJoinRequest({
          groupJoinRequestId: groupJoinRequestId,
          status: action,
          reviewedBy: session.id_user,
        })
        .catch((error) => {
          logError("update", "Update group join request failed", error);
          return next(parseMongoError(error));
        });

      if (!groupJoinRequest) {
        return next(
          new ServerError(
            req.t("modules.chat.group-join-requests.update.feedback.error"),
            "UPDATE_GROUP_JOIN_REQUEST_FAIL"
          )
        );
      }

      if (action === "APPROVED") {
        // Thêm người dùng vào nhóm trò chuyện
        const joinGroupConversation = await groupConversationsService
          .joinGroup({
            groupId: groupId,
            userId: groupJoinRequest.userId.toString(),
          })
          .catch((error) => {
            logError("update", "Join group conversation failed", error);
            return next(parseMongoError(error));
          });

        if (!joinGroupConversation) {
          return next(
            new ServerError(
              req.t("modules.chat.group-join-requests.update.feedback.error"),
              "JOIN_GROUP_CONVERSATION_FAIL"
            )
          );
        }

        //xoá yêu cầu tham gia nhóm trong group join requests
        const deleteGroupJoinRequest = await groupJoinRequestsService
          .deleteById(groupJoinRequestId)
          .catch((error) => {
            logError("update", "Delete group join request failed", error);
            return next(parseMongoError(error));
          });
        //xoá yêu cầu tham gia nhóm trong group conversation
        const deleteGroupConversationJoinRequest =
          await groupConversationsService
            .deleteJoinRequestsId({
              groupId: groupId,
              groupJoinRequestId: groupJoinRequestId,
            })
            .catch((error) => {
              logError(
                "update",
                "Delete group conversation join request failed",
                error
              );
              return next(parseMongoError(error));
            });
      }

      return res.status(200).json({
        message: req.t(
          "modules.chat.group-join-requests.update.feedback.success"
        ),
        // data: groupJoinRequest,
      });
    } catch (error) {
      logError("update", "Update group join request failed", error);
      return next(
        new ServerError(
          req.t("modules.chat.group-join-requests.update.feedback.error")
        )
      );
    }
  }
}
