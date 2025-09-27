import { Request, Response, NextFunction } from "express";

import { postCommentsService } from "@modules/post/service/PostComments/PostComments.service";
import { logError } from "@/shared/utils/log";
import {
  BadRequestError,
  ServerError,
  JoiRequestValidationError,
} from "@/shared/globals/exceptions/error-handler";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

export class GetPostComments {
  public async getAll(
    req: Request<{
      postId: string;
    }>,
    res: Response,
    next: NextFunction
  ) {
    const { postId } = req.params;
    const { page, limit, replyPage, replyLimit } = req.query;

    const missingFields = [];
    if (!postId) missingFields.push("postId");
    if (missingFields.length > 0) {
      return next(
        new JoiRequestValidationError(
          req.t("validation.missing-parameter"),
          "MISSING_FIELDS"
        )
      );
    }

    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 50 ? parseInt(limit as string) : 50;
    const _replyPage = parseInt(replyPage as string) || 1;
    const _replyLimit =
      parseInt(replyLimit as string) <= 50
        ? parseInt(replyLimit as string)
        : 50;

    try {
      // Fetch all comments for the post
      const comments = await postCommentsService
        .getAllByPostId({
          postId: postId,
          page: _page,
          limit: _limit,
          replyPage: _replyPage,
          replyLimit: _replyLimit,
          onlyParent: true,
        })
        .catch((error) => {
          logError("get", "Get post comments failed", error);
          return next(
            parseMongoError(error, req.t("modules.post.comments.get.all.error"))
          );
        });

      //   if (!comments) {
      //     return next(
      //       new BadRequestError(
      //         req.t("modules.post.comments.get.all.error"),
      //         "POST_COMMENTS_NOT_FOUND"
      //       )
      //     );
      //   }
      const totalComments = await postCommentsService.getCountAllByPostId(
        postId
      );
      const totalPages = Math.ceil(totalComments / _limit);

      return res.status(200).json({
        message: req.t("modules.post.comments.get.all.success"),
        data: comments,
        currentPage: _page,
        totalPages: totalPages,
        totalComments: totalComments,
      });
    } catch (error) {
      logError("get", "Get post comments error", error);
      return next(
        new ServerError(req.t("modules.post.comments.get.all.error"))
      );
    }
  }

  public async getAllReply(
    req: Request<{
      postId: string;
      commentId: string;
    }>,
    res: Response,
    next: NextFunction
  ) {
    const { postId, commentId } = req.params;
    const { page, limit } = req.query;

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
    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 80 ? parseInt(limit as string) : 80;
    try {
      // Fetch all replies for the comment
      const replies = await postCommentsService
        .getRepliesByParentId({
          parentId: commentId,
          page: _page,
          limit: _limit,
        })
        .catch((error) => {
          logError("getAllReply", "Get post comment replies failed", error);
          return next(
            parseMongoError(
              error,
              req.t("modules.post.comments.get.reply.error")
            )
          );
        });

      //   if (!replies) {
      //     return next(
      //       new BadRequestError(
      //         req.t("modules.post.comments.get.reply.error"),
      //         "POST_COMMENT_REPLIES_NOT_FOUND"
      //       )
      //     );
      //   }
      const totalReplies =
        await postCommentsService.getCountAllRepliesByParentId(commentId);

      const totalPages = Math.ceil(totalReplies / _limit);

      return res.status(200).json({
        message: req.t("modules.post.comments.get.reply.success"),
        data: replies,
        currentPage: _page,
        totalPages: totalPages,
        totalReplies: totalReplies,
      });
    } catch (error) {
      logError("getAllReply", "Get post comment replies error", error);
      return next(
        new ServerError(req.t("modules.post.comments.get.reply.error"))
      );
    }
  }
}
