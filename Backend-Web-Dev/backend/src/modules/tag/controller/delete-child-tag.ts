import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";
import { postService } from "@/modules/post/service/post.service";

export class DeleteChildTag {
  public async delete(req: Request, res: Response, next: NextFunction) {
    const { slug, child_slug } = req.body;
    const missingFields = [];
    if (!slug) missingFields.push("slug");
    if (!child_slug) missingFields.push("child_slug");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const post = await postService.deleteByCategory([child_slug.toString()]);
      if (!post) {
        return next(
          new BadRequestError(
            req.t("modules.tag.child-tag.delete.error"),
            "DELETE_POST_FAIL"
          )
        );
      }
      const tag = await tagService.deleteChildTag(slug, child_slug);
      if (!tag) {
        return next(
          new BadRequestError(
            req.t("modules.tag.child-tag.delete.error"),
            "DELETE_CHILD_TAG_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.tag.child-tag.delete.success"),
        // data: tag,
      });
    } catch (error) {
      logError("delete-child-tag", "Delete child tag fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.child-tag.delete.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
