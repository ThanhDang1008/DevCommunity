import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

export class GetDetailTag {
  public async read(req: Request, res: Response, next: NextFunction) {
    const { tags } = req.body;
    const missingFields = [];
    if (!tags) missingFields.push("tags");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      if (tags?.length === 1) {
        const tag = await tagService.getTagBySlug(tags[0]?.toString() || "");
        if (!tag) {
          return next(
            new BadRequestError(
              req.t("modules.tag.get-detail.error"),
              "GET_TAG_DETAIL_FAIL"
            )
          );
        }
        return res.status(200).json({
          message: req.t("modules.tag.get-detail.success"),
          data: [tag],
        });
      } else {
        const tag = await tagService.getTagBySlug(tags[0]?.toString() || "");
        const childTag = await tagService.getChildTagBySlug(
          tags[0]?.toString() || "",
          tags[1]?.toString() || ""
        );
        if (!tag || !childTag) {
          return next(
            new BadRequestError(
              req.t("modules.tag.get-detail.error"),
              "GET_TAG_DETAIL_FAIL"
            )
          );
        }
        return res.status(200).json({
          message: req.t("modules.tag.get-detail.success"),
          data: [tag, childTag],
        });
      }
    } catch (error) {
      logError("get-detail-tag", "Get detail tag fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.get-detail.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
