import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

export class GetAllTag {
  public async read(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await tagService.getAllTag();
      if (!tags) {
        return next(
          new BadRequestError(
            req.t("modules.tag.get-all.error"),
            "GET_ALL_TAG_FAIL"
          )
        );
      }
      return res.status(200).json({
        message: req.t("modules.tag.get-all.success"),
        data: tags,
      });
    } catch (error) {
      logError("get-all-tag", "Get all tag fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.tag.get-all.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
