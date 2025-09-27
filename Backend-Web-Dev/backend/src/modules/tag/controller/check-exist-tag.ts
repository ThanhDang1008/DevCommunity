import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

export class CheckExistTag {
  public async check(req: Request, res: Response, next: NextFunction) {
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
      const tag = await tagService.checkExistTag(slug);
      if (!tag) {
        return res.status(200).json({
          message: req.t("modules.tag.exist.found"),
        });
      }
      return res.status(400).json({
        message: req.t("modules.tag.exist.not-found"),
      });
    } catch (error) {
      logError("check-exist-tag", "Check exist tag fail", error);
      return next(
        new ServerError(
          req.t("server.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
