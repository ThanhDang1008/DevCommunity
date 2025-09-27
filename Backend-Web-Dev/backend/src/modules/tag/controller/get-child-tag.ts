import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

export class GetChildTag {
  public async getById(req: Request, res: Response, next: NextFunction) {
    const { tag_id, child_tag_id } = req.body;
    const missingFields = [];
    if (!tag_id) missingFields.push("tag_id");
    if (!child_tag_id) missingFields.push("child_tag_id");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const tag = await tagService.getChildTagById(
        tag_id?.toString() || "",
        child_tag_id?.toString() || ""
      );
      if (!tag) {
        return next(
          new BadRequestError(
            req.t("modules.tag.child-tag.get-detail.error"),
            "GET_CHILD_TAG_BY_ID_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.tag.child-tag.get-detail.success"),
        data: tag,
      });
    } catch (error) {
      logError("get-child-tag", "Get child tag by id fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.child-tag.get-detail.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }

  public async getAllBySlug(req: Request, res: Response, next: NextFunction) {
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
      const tag = await tagService.getAllChildTagBySlug(slug);
      if (!tag) {
        return next(
          new BadRequestError(
            req.t("modules.tag.child-tag.get-detail.error"),
            "GET_CHILD_TAG_BY_SLUG_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.tag.child-tag.get-detail.success"),
        data: tag,
      });
    } catch (error) {
      logError("get-child-tag", "Get child tag by slug fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.child-tag.get-detail.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
