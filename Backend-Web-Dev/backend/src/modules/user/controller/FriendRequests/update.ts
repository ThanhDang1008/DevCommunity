import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";
import { friendRequestsService } from "@/modules/user/service/FriendRequests/FriendRequests.service";
import { userService } from "@/modules/user/service/user.service";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import {
  EnumFriendRequestStatus,
  type TypeFriendRequestStatus,
} from "../../schemes/FriendRequests.model";

export class UpdateFriendRequests {
  public async feedback(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      {
        status: TypeFriendRequestStatus;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;
    const { friendRequestId } = req.params;
    const { status } = req.body;

    try {
      if (status === EnumFriendRequestStatus.REJECTED) {
        // Delete the friend request
        const deleteFriendRequest = await friendRequestsService
          .deleteById(friendRequestId)
          .catch((error) => {
            logError("update", "Delete friend request failed", error);
            return next(
              parseMongoError(
                error,
                req.t("modules.user.friend-requests.update.feedback.error")
              )
            );
          });

        // if (!deleteFriendRequest) {
        //   return next(
        //     new BadRequestError(
        //       req.t("modules.user.friend-requests.update.feedback.error"),
        //       "DELETE_FRIEND_REQUEST_FAIL"
        //     )
        //   );
        // }
        return res.status(200).json({
          message: req.t(
            "modules.user.friend-requests.update.feedback.success"
          ),
        });
      }

      // Cập nhật trạng thái yêu cầu kết bạn
      const updateFriendRequest = await friendRequestsService
        .updateStatusFriendRequest({
          friendRequestId: friendRequestId,
          status: status as EnumFriendRequestStatus,
        })
        .catch((error) => {
          logError("update", "Update friend request status failed", error);
          return next(
            parseMongoError(
              error,
              req.t("modules.user.friend-requests.update.feedback.error")
            )
          );
        });

      if (!updateFriendRequest) {
        return next(
          new BadRequestError(
            req.t("modules.user.friend-requests.update.feedback.error"),
            "UPDATE_FRIEND_REQUEST_FAIL"
          )
        );
      }

      if (status === EnumFriendRequestStatus.ACCEPTED) {
        //thêm bạn bè vào danh sách bạn bè của người dùng
        const updateUserReceiver = await userService
          .addListFriend({
            userId: updateFriendRequest.receiverId.toString(),
            listFriendId: [updateFriendRequest.senderId.toString()],
          })
          .catch((error) => {
            logError("update", "Update user friend list failed", error);
            return next(
              parseMongoError(
                error,
                req.t("modules.user.friend-requests.update.feedback.error")
              )
            );
          });

        const updateUserSender = await userService
          .addListFriend({
            userId: updateFriendRequest.senderId.toString(),
            listFriendId: [updateFriendRequest.receiverId.toString()],
          })
          .catch((error) => {
            logError("update", "Update user friend list failed", error);
            return next(
              parseMongoError(
                error,
                req.t("modules.user.friend-requests.update.feedback.error")
              )
            );
          });

        if (!updateUserReceiver || !updateUserSender) {
          return next(
            new BadRequestError(
              req.t("modules.user.friend-requests.update.feedback.error"),
              "UPDATE_USER_FRIEND_LIST_FAIL"
            )
          );
        }

        //xoá yêu cầu kết bạn của người dùng
        const deleteFriendRequest = await friendRequestsService
          .deleteById(friendRequestId)
          .catch((error) => {
            logError("update", "Delete friend request failed", error);
            return next(
              parseMongoError(
                error,
                req.t("modules.user.friend-requests.update.feedback.error")
              )
            );
          });
      }

      return res.status(200).json({
        message: req.t("modules.user.friend-requests.update.feedback.success"),
      });
    } catch (error) {
      logError("update", "Feedback friend request failed", error);
      return next(
        new ServerError(req.t("modules.user.friend-requests.feedback.error"))
      );
    }
  }

  public async cancel(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;
    const { friendRequestId } = req.params;

    try {
      // Xoá yêu cầu kết bạn
      const deleteFriendRequest = await friendRequestsService
        .deleteBySenderIdAndReceiverId(session.id_user, friendRequestId)
        .catch((error) => {
          logError("cancel", "Delete friend request failed", error);
          return next(
            parseMongoError(
              error,
              req.t("modules.user.friend-requests.update.cancel.error")
            )
          );
        });

      if (!deleteFriendRequest) {
        return next(
          new BadRequestError(
            req.t("modules.user.friend-requests.update.cancel.error"),
            "DELETE_FRIEND_REQUEST_FAIL"
          )
        );
      }

      // Cập nhật người dùng
      const updateUser = await userService
        .updateFriendRequest({
          userId: session.id_user,
          friendId: deleteFriendRequest.receiverId.toString(),
          type: "remove",
        })
        .catch((error) => {
          logError("cancel", "Update user friend request failed", error);
          return next(parseMongoError(error));
        });

      return res.status(200).json({
        message: req.t("modules.user.friend-requests.update.cancel.success"),
      });
    } catch (error) {
      logError("cancel", "Cancel friend request error", error);
      return next(
        new ServerError(
          req.t("modules.user.friend-requests.update.cancel.error")
        )
      );
    }
  }
}
