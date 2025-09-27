import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

export class UpdateChildTag {
  public async update(req: Request, res: Response, next: NextFunction) {
    const { tag_id, child_tag_id, name, description } = req.body;
    const missingFields = [];
    if (!tag_id) missingFields.push("tag_id");
    if (!child_tag_id) missingFields.push("child_tag_id");
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
      const tag = await tagService.updateChildTag({
        tag_id: tag_id,
        child_tag_id: child_tag_id,
        name: name,
        description: description || "",
      });
      if (!tag) {
        return next(
          new BadRequestError(
            req.t("modules.tag.child-tag.update.error"),
            "UPDATE_CHILD_TAG_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.tag.child-tag.update.success"),
        data: tag,
      });
    } catch (error) {
      logError("update-child-tag", "Update child tag fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.child-tag.update.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
