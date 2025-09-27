import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

export class GetAllChildTag {
  public async readByTagId(
    req: Request<{ tag_id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { tag_id } = req.params;
    const missingFields = [];
    if (!tag_id) missingFields.push("tag_id");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const tags = await tagService.getAllChildTag(tag_id);
      if (!tags) {
        return next(
          new BadRequestError(
            req.t("modules.tag.child-tag.get-all.error"),
            "GET_ALL_CHILD_TAG_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.tag.child-tag.get-all.success"),
        data: tags,
      });
    } catch (error) {
      logError("get-all-child-tag", "Get all child tag fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.child-tag.get-all.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
