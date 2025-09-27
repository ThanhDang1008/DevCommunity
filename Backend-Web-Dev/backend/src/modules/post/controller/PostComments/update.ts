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

export class UpdatePostComments {
  public async updateReaction(
    req: Request<
      {},
      {},
      {
        commentId: string;
        type: string;
        increment: string | boolean;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    const { commentId, type, increment } = req.body;

    const missingFields = [];
    if (!commentId) missingFields.push("commentId");
    if (!type) missingFields.push("type");
    if (increment === undefined) missingFields.push("increment");

    if (missingFields.length > 0) {
      return next(
        new JoiRequestValidationError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const response = await postCommentsService
        .updateReaction({
          commentId: commentId,
          userId: session.id_user,
          type: type,
          increment: increment === "true" || increment === true,
        })
        .catch((error) => {
          logError("update-post-comments", "updateReaction fail", error);
          next(
            parseMongoError(
              error,
              req.t("modules.post.comments.update.reaction.error")
            )
          );
        });

      if (!response) {
        return next(
          new BadRequestError(
            req.t("modules.post.comments.update.reaction.error"),
            "UPDATE_REACTION_FAIL"
          )
        );
      }

      res.status(200).json({
        message: req.t("modules.post.comments.update.reaction.success"),
      });
    } catch (error) {
      logError("update-post-comments", "updateReaction fail", error);
      next(
        new ServerError(req.t("modules.post.comments.update.reaction.error"))
      );
    }
  }

  public async update(
    req: Request<
      {},
      {},
      {
        commentId: string;
        content: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    // const session = JSON.parse(
    //   req.headers["session"] as string
    // ) as ReqHeaderSession;

    const { commentId, content } = req.body;

    const missingFields = [];
    if (!commentId) missingFields.push("commentId");
    if (!content) missingFields.push("content");

    if (missingFields.length > 0) {
      return next(
        new JoiRequestValidationError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const response = await postCommentsService
        .updateContent({
          commentId: commentId,
          content: content,
        })
        .catch((error) => {
          logError("update-post-comments", "updateContent fail", error);
          next(
            parseMongoError(
              error,
              req.t("modules.post.comments.update.content.error")
            )
          );
        });

      if (!response) {
        return next(
          new BadRequestError(
            req.t("modules.post.comments.update.content.error"),
            "UPDATE_CONTENT_FAIL"
          )
        );
      }

      if (response && response.parentId === null) {
        socketIOPostObject.emit(
          `${EnumPostEvent.POST_COMMENT_UPDATED}_${response.postId}`,
          {
            postId: response.postId,
            commentId: response._id,
            parentId: response.parentId,
            content: response.content,
            status: response.status,
          }
        );
      }

      if (response && response.parentId !== null) {
        socketIOPostObject.emit(
          `${EnumPostEvent.POST_COMMENT_UPDATED}_${response.postId}_${response.parentId}`,
          {
            postId: response.postId,
            commentId: response._id,
            parentId: response.parentId,
            content: response.content,
            status: response.status,
          }
        );
      }

      res.status(200).json({
        message: req.t("modules.post.comments.update.content.success"),
      });
    } catch (error) {
      logError("update-post-comments", "updateContent fail", error);
      next(
        new ServerError(req.t("modules.post.comments.update.content.error"))
      );
    }
  }
}
