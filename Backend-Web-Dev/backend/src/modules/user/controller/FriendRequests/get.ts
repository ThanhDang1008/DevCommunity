import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";
import { friendRequestsService } from "@/modules/user/service/FriendRequests/FriendRequests.service";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";

export class GetFriendRequests {
  public async getAllBySenderId(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    try {
      // Fetch all friend requests for the user
      const friendRequests = await friendRequestsService
        .getAllFriendRequestsBySenderId(session.id_user)
        .catch((error) => {
          logError("get", "Get friend requests failed", error);
          return next(
            parseMongoError(
              error,
              req.t("modules.user.friend-requests.get.all.error")
            )
          );
        });

      if (!friendRequests) {
        return next(
          new BadRequestError(
            req.t("modules.user.friend-requests.get.all.error"),
            "FRIEND_REQUEST_NOT_FOUND"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.user.friend-requests.get.all.success"),
        data: friendRequests,
      });
    } catch (error) {
      logError("get", "Get friend requests error", error);
      return next(
        new ServerError(req.t("modules.user.friend-requests.get.all.error"))
      );
    }
  }

  public async getAllByReceiverId(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    try {
      // Fetch all friend requests for the user
      const friendRequests = await friendRequestsService
        .getAllFriendRequestsByReceiverId(session.id_user)
        .catch((error) => {
          logError("get", "Get friend requests failed", error);
          return next(
            parseMongoError(
              error,
              req.t("modules.user.friend-requests.get.all.error")
            )
          );
        });

      if (!friendRequests) {
        return next(
          new BadRequestError(
            req.t("modules.user.friend-requests.get.all.error"),
            "FRIEND_REQUEST_NOT_FOUND"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.user.friend-requests.get.all.success"),
        data: friendRequests,
      });
    } catch (error) {
      logError("get", "Get friend requests error", error);
      return next(
        new ServerError(req.t("modules.user.friend-requests.get.all.error"))
      );
    }
  }
}
