import { Request, Response, NextFunction } from "express";

import { userService } from "@/modules/user/service/user.service";
import { config } from "@/config.app";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { logError } from "@/shared/utils/log";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";
import { statusAccount } from "@/constants/common";

import { hashPassword } from "@/modules/auth/utils/auth.util";

export class CreateUser {
  public async handle(req: Request, res: Response, next: NextFunction) {
    const { fullname, email, password, id_role } = req.body;

    const missingFields = [];
    if (!fullname) missingFields.push("fullname");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!id_role) missingFields.push("id_role");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const userExists = await userService
        .checkEmailExist(email)
        .catch((error) => {
          logError("create-user", "Check email exists failed", error);
          return next(
            parseMongoError(
              error,
              req.t("modules.user.create.handle.error")
            )
          );
        });

      if (userExists) {
        return next(
          new BadRequestError(
            req.t("modules.user.create.handle.email-exists"),
            "EMAIL_EXISTS"
          )
        );
      }

      const hashedPassword = await hashPassword(password);
      const newUser = await userService
        .createUser({
          fullname,
          email,
          password: hashedPassword,
          id_role,
          status: statusAccount.VERIFIED,
        })
        .catch((error) => {
          logError("create-user", "Create user failed", error);
          return next(
            new ServerError(
              req.t("modules.user.create.handle.error"),
              "CREATE_USER_ERROR"
            )
          );
        });

      return res.status(201).json({
        message: req.t("modules.user.create.handle.success"),
        data: newUser,
      });
    } catch (error) {
      logError("create-user", "Create user failed", error);
      return next(new ServerError(req.t("modules.user.create.handle.error")));
    }
  }
}
