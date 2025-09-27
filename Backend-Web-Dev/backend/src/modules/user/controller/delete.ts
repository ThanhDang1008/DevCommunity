import { Request, Response, NextFunction } from "express";

import { userService } from "@/modules/user/service/user.service";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { logError } from "@/shared/utils/log";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

export class DeleteUser {
  public async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;

    const missingFields = [];
    if (!id) missingFields.push("id");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const deletedUser = await userService
        .deleteUserById(id)
        .catch((error) => {
          logError("delete-user", "Delete user failed", error);
          return next(
            parseMongoError(error, req.t("modules.user.delete.handle.error"))
          );
        });

      if (!deletedUser) {
        return next(
          new BadRequestError(
            req.t("modules.user.delete.handle.error"),
            "DELETE_USER_FAIL"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.user.delete.handle.success"),
      });
    } catch (error) {
      logError("delete-user", "delete fail", error);
      return next(new ServerError(req.t("modules.user.delete.handle.error")));
    }
  }
}
