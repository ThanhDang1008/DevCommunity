import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

export class GetTagById {
  public async read(req: Request, res: Response, next: NextFunction) {
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
      const tag = await tagService.getTagById(tag_id);
      if (!tag) {
        return next(
          new BadRequestError(
            req.t("modules.tag.get-detail.error"),
            "GET_TAG_BY_ID_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.tag.get-detail.success"),
        data: tag,
      });
    } catch (error) {
      logError("get-tag-by-id", "Get tag by id fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.get-detail.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
