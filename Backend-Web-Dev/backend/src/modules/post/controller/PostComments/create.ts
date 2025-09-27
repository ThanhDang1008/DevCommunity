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

export class CreatePostComments {
  public async handle(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;
    const { postId, content, parentId, UUID } = req.body;

    const missingFields = [];
    if (!postId) missingFields.push("postId");
    if (!content) missingFields.push("content");
    if (!UUID) missingFields.push("UUID");
    if (missingFields.length > 0) {
      return next(
        new JoiRequestValidationError(
          req.t("validation.missing-parameter"),
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const postComment = await postCommentsService
        .create({
          postId: postId,
          userId: session.id_user,
          content: content,
          parentId: parentId ? parentId : null,
        })
        .catch((error) => {
          logError("create-post-comment", "Create post comment failed", error);
          return next(parseMongoError(error));
        });

      if (!postComment) {
        return next(
          new ServerError(
            req.t("modules.post.comments.create.handle.error"),
            "CREATE_POST_COMMENT_FAIL"
          )
        );
      }
      //console.log("postComment", postComment);
      if (postComment && postComment?.parentId === null) {
        socketIOPostObject.emit(
          `${EnumPostEvent.POST_COMMENT_ADDED}_${postId}`,
          {
            UUID: UUID,
            postId: postId,
            comment: {
              ...postComment,
              replies: [],
              totalReplies: 0,
            },
          }
        );
      }
      if (postComment && postComment?.parentId !== null) {
        socketIOPostObject.emit(
          `${EnumPostEvent.POST_COMMENT_ADDED}_${postId}_${postComment.parentId}`,
          {
            UUID: UUID,
            postId: postId,
            comment: {
              ...postComment,
            },
          }
        );
      }

      return res.status(201).json({
        message: req.t("modules.post.comments.create.handle.success"),
        data: postComment,
      });
    } catch (error) {
      logError("create", "Create post comment failed", error);
      return next(
        new ServerError(req.t("modules.post.comments.create.handle.error"))
      );
    }
  }
}
