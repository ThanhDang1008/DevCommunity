import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

export class GetAllTagHeader {
  public async read(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await tagService.getAllTagHeader();
      if (!tags) {
        return next(
          new BadRequestError(
            req.t("modules.tag.get-all.error"),
            "GET_ALL_TAG_HEADER_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.tag.get-all.success"),
        data: tags,
      });
    } catch (error) {
      logError("get-tag-header", "Get all tag header fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.get-all.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
