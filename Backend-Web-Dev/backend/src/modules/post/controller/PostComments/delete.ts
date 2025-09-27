import { Request, Response, NextFunction } from "express";

import { postCommentsService } from "@modules/post/service/PostComments/PostComments.service";
import { logError } from "@/shared/utils/log";
import {
  BadRequestError,
  ServerError,
  JoiRequestValidationError,
} from "@/shared/globals/exceptions/error-handler";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

import { socketIOPostObject } from "@modules/post/events/PostComments/postEvents";
import { EnumPostEvent } from "@modules/post/constants/common";
import { console } from "inspector";

export class DeletePostComments {
  public async handle(req: Request, res: Response, next: NextFunction) {
    // const session = JSON.parse(
    //   req.headers["session"] as string
    // ) as ReqHeaderSession;
    const { postId, commentId, parentId } = req.body;

    //console.log("Delete post comment", req.body);

    const missingFields = [];
    if (!postId) missingFields.push("postId");
    if (!commentId) missingFields.push("commentId");
    if (missingFields.length > 0) {
      return next(
        new JoiRequestValidationError(
          req.t("validation.missing-parameter"),
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const deleted = await postCommentsService
        .deleteById({
          commentId: commentId,
          parentId: parentId ? parentId : null,
        })
        .catch((error) => {
          logError("delete-post-comment", "Delete post comment failed", error);
          return next(
            parseMongoError(
              error,
              req.t("modules.post.comments.delete.handle.error")
            )
          );
        });

      if (!deleted) {
        return next(
          new ServerError(
            req.t("modules.post.comments.delete.handle.error"),
            "DELETE_POST_COMMENT_FAIL"
          )
        );
      }

      if (!parentId) {
        socketIOPostObject.emit(
          `${EnumPostEvent.POST_COMMENT_DELETED}_${postId}`,
          {
            postId: postId,
            commentId: commentId,
            parentId: null,
          }
        );
      }
      if (parentId) {
        socketIOPostObject.emit(
          `${EnumPostEvent.POST_COMMENT_DELETED}_${postId}_${parentId}`,
          {
            postId: postId,
            commentId: commentId,
            parentId: parentId,
          }
        );
      }

      res.status(200).json({
        message: req.t("modules.post.comments.delete.handle.success"),
      });
    } catch (error) {
      logError("delete-post-comment", "Delete post comment error", error);
      return next(new ServerError(req.t("server.error")));
    }
  }
}
