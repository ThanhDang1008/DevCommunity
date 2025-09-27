import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";
import { postService } from "@/modules/post/service/post.service";

export class DeleteTag {
  public async delete(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.body;
    const missingFields = [];
    if (!slug) missingFields.push("slug");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const post = await postService.deleteByCategory([slug.toString()]);
      if (!post) {
        return next(
          new BadRequestError(
            req.t("modules.tag.delete.error"),
            "DELETE_POST_FAIL"
          )
        );
      }
      const tag = await tagService.deleteTag(slug.toString());
      if (!tag) {
        return next(
          new BadRequestError(
            req.t("modules.tag.delete.error"),
            "DELETE_TAG_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.tag.delete.success"),
        //data: tag,
      });
    } catch (error) {
      logError("delete-tag", "Delete tag fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.delete.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
