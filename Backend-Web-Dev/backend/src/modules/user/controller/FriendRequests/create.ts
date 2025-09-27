import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";
import { friendRequestsService } from "@/modules/user/service/FriendRequests/FriendRequests.service";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { userService } from "@/modules/user/service/user.service";

export class CreateFriendRequests {
  public async send(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;
    const { friendId, requestMessage } = req.body;

    try {
      const friendRequest = await friendRequestsService
        .create({
          userId: session.id_user,
          friendId: friendId,
          requestMessage: requestMessage || "",
        })
        .catch((error) => {
          logError("create", "Create friend request failed", error);
          return next(parseMongoError(error));
        });

      if (!friendRequest) {
        return next(
          new BadRequestError(
            req.t("modules.user.friend-requests.create.send.error"),
            "CREATE_FRIEND_REQUEST_FAIL"
          )
        );
      }

      const updateUser = await userService
        .updateFriendRequest({
          userId: session.id_user,
          friendId: friendId,
          type: "add",
        })
        .catch((error) => {
          logError("create", "Update user friend request failed", error);
          return next(parseMongoError(error));
        });

      return res.status(201).json({
        message: req.t("modules.user.friend-requests.create.send.success"),
        data: friendRequest,
      });
    } catch (error) {
      logError("create", "Create friend request error", error);
      return next(
        new ServerError(req.t("modules.user.friend-requests.create.send.error"))
      );
    }
  }
}
