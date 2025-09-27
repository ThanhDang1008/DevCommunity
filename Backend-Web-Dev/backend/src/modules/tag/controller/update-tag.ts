import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

export class UpdateTag {
  public async update(req: Request, res: Response, next: NextFunction) {
    const { _id, name, description } = req.body;
    const missingFields = [];
    if (!_id) missingFields.push("_id");
    if (!name) missingFields.push("name");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const tag = await tagService.updateTag({
        _id: _id,
        name: name,
        description: description || "",
      });
      if (!tag) {
        return next(
          new BadRequestError(
            req.t("modules.tag.update.error"),
            "UPDATE_TAG_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.tag.update.success"),
        data: tag,
      });
    } catch (error) {
      logError("update-tag", "Update tag fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.update.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
