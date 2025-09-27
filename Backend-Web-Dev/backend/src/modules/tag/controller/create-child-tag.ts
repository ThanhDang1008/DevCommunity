import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { tagService } from "../service/tag.service";
import { logError } from "@/shared/utils/log";

import type { CreateChildTag as TypeCreateChildTag } from "../interfaces/tag.interface";

export class CreateChildTag {
  public async create(
    req: Request<{}, {}, TypeCreateChildTag>,
    res: Response,
    next: NextFunction
  ) {
    const { tag_id, child } = req.body;
    const missingFields = [];
    if (!tag_id) missingFields.push("tag_id");
    if (!child) missingFields.push("child");
    if (!child[0]?.name) missingFields.push("child.name");
    if (!child[0]?.slug) missingFields.push("child.slug");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    //console.log(req.body);
    try {
      const child_tag = await tagService.createChildTag({
        tag_id: tag_id,
        child: child,
      });
      if (!child_tag) {
        return next(
          new BadRequestError(
            req.t("modules.tag.child-tag.create.error"),
            "CREATE_CHILD_TAG_FAIL"
          )
        );
      }
      return res.status(201).json({
        message: req.t("modules.tag.child-tag.create.success"),
        data: child_tag,
      });
    } catch (error) {
      logError("create-child-tag", "Create child tag fail", error);
      return next(
        new ServerError(
          req.t("modules.tag.child-tag.create.error"),
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }
}
