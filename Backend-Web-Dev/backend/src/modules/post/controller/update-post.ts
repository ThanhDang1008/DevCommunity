import { Request, Response, NextFunction } from "express";

import { postService } from "../service/post.service";
import { logError } from "@/shared/utils/log";
import {
  BadRequestError,
  ServerError,
  JoiRequestValidationError,
} from "@/shared/globals/exceptions/error-handler";
import { statusPost } from "@modules/post/constants/common";

export class UpdatePost {
  public async update(req: Request, res: Response, next: NextFunction) {
    const {
      _id,
      title,
      description,
      content,
      toc,
      thumbnail,
      link,
      category,
      tags,
      keywords,
      status,
      createdAt,
    } = req.body;
    const missingFields = [];
    if (!_id) missingFields.push("_id");
    if (!title) missingFields.push("title");
    if (!content) missingFields.push("content");
    if (!category) missingFields.push("category");
    if (!status) missingFields.push("status");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Update post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    if (!Object.values(statusPost).includes(status)) {
      return next(
        new BadRequestError(
          "field (status) must be one of the following: " +
            Object.values(statusPost).join(", "),
          "STATUS_INVALID"
        )
      );
    }

    try {
      const post = await postService.updatePost({
        _id: _id,
        title: title,
        description: description ? description : "",
        content: content,
        toc: toc,
        thumbnail: thumbnail ? thumbnail : "",
        link: link,
        category: category.filter((item: string) => item !== ""),
        tags: tags,
        keywords: keywords,
        status: status,
        createdAt: createdAt ? createdAt : new Date().toISOString(),
      });
      if (!post) {
        return next(
          new BadRequestError("Cập nhật bài viết thất bại", "UPDATE_POST_FAIL")
        );
      }
      return res.status(200).json({
        message: "Cập nhật bài viết thành công",
        data: post,
      });
    } catch (error) {
      logError("update-post", "update post fail", error);
      return next(
        new ServerError("Cập nhật bài viết thất bại", "INTERNAL_SERVER_ERROR")
      );
    }
  }

  public async updateRankPost(req: Request, res: Response, next: NextFunction) {
    const { _id, rank } = req.body;
    const missingFields = [];
    if (!_id) missingFields.push("_id");
    if (rank !== 0 && !rank) missingFields.push("rank");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Update rank post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const post = await postService.updateRank(_id, Number(rank));
      if (!post) {
        return next(
          new BadRequestError(
            "Cập nhật rank bài viết thất bại",
            "UPDATE_RANK_POST_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: "Cập nhật rank bài viết thành công",
        data: post,
      });
    } catch (error) {
      logError("update-post", "updateRankPost fail", error);
      return next(
        new ServerError(
          "Cập nhật rank bài viết thất bại",
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }

  public async increaseViewPost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { slug } = req.body;
    const missingFields = [];
    if (!slug) missingFields.push("slug");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Increase view post fail, missing fields: ${missingFields.join(
            ", "
          )}`,
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const post = await postService.increaseView(slug);
      if (!post) {
        return next(
          new BadRequestError("Increase view post fail", "INCREASE_VIEW_FAIL")
        );
      }
      return res.status(200).json({
        message: "Increase view post success",
      });
    } catch (error) {
      logError("update-post", "increaseViewPost fail", error);
      return next(
        new ServerError("Increase view post fail", "INTERNAL_SERVER_ERROR")
      );
    }
  }

  public async updateReactionPost(
    req: Request<
      {},
      {},
      {
        postId: string;
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

    const { postId, type, increment } = req.body;
    const missingFields = [];
    if (!postId) missingFields.push("postId");
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

    // if (!Object.values(EnumPostReactionType).includes(type)) {
    //   return next(
    //     new BadRequestError(
    //       `field (type) must be one of the following: ${Object.values(
    //         EnumPostReactionType
    //       ).join(", ")}`,
    //       "TYPE_INVALID"
    //     )
    //   );
    // }

    try {
      const post = await postService.reactionPost({
        postId,
        userId: session.id_user,
        type,
        increment: increment === "true" || increment === true,
      });
      if (!post) {
        return next(
          new BadRequestError(
            req.t("modules.post.update.reaction.error"),
            "UPDATE_REACTION_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.post.update.reaction.success"),
      });
    } catch (error) {
      logError("update-post", "updateReactionPost fail", error);
      return next(new ServerError(req.t("modules.post.update.reaction.error")));
    }
  }

  public async updateSharedByListUserId(
    req: Request<
      {},
      {},
      {
        postId: string;
        increment: boolean | string;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    const { postId, increment } = req.body;
    const missingFields = [];
    if (!postId) missingFields.push("postId");
    if (increment === undefined) missingFields.push("increment");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const post = await postService.updateSharedByListUserId({
        postId,
        userId: session.id_user,
        increment: increment === "true" || increment === true,
      });
      if (!post) {
        return next(
          new BadRequestError(
            req.t("modules.post.update.shared.error"),
            "UPDATE_SHARED_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.post.update.shared.success"),
      });
    } catch (error) {
      logError("update-post", "updateSharedByListUserId fail", error);
      return next(new ServerError(req.t("modules.post.update.shared.error")));
    }
  }
}
