import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

export class CreateTag {
  public async create(req: Request, res: Response, next: NextFunction) {
    const { name, slug, description } = req.body;
    const missingFields = [];
    if (!name) missingFields.push("name");
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
      const tag = await tagService.createTag({
        name: name,
        slug: slug,
        description: description || "",
      });
      if (!tag) {
        return next(
          new BadRequestError(
            req.t("modules.tag.create.error"),
            "CREATE_TAG_FAIL"
          )
        );
      }
      return res.status(201).json({
        message: req.t("modules.tag.create.success"),
        data: tag,
      });
    } catch (error) {
      logError("create-tag", "Create tag fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.create.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
