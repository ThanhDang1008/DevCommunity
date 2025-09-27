import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { userService } from "@/modules/user/service/user.service";
import { hashPassword } from "@/modules/auth/utils/auth.util";
import { verifyToken, TokenStatus } from "@/shared/globals/helpers/jwt.auth";
import { logError } from "@/shared/utils/log";
import { keyJWT, statusAccount } from "@/constants/common";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

export class Register {
  public async create(req: Request, res: Response, next: NextFunction) {
    const { fullname, password, token } = req.body;

    const missingFields = [];
    if (!fullname) missingFields.push("fullname");
    if (!password) missingFields.push("password");
    if (!token) missingFields.push("token");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }

    try {
      type Payload = {
        email: string;
        key: string;
        iat: number;
        exp: number;
      };

      const { status, payload } = verifyToken<Payload>(token);
      if (status === TokenStatus.TOKEN_INVALID) {
        return next(
          new NotAuthorizedError(
            req.t("modules.auth.register.create.error"),
            "TOKEN_INVALID"
          )
        );
      }

      if (status === TokenStatus.TOKEN_EXPIRED) {
        return next(
          new NotAuthorizedError(
            req.t("modules.auth.register.create.error"),
            "TOKEN_EXPIRED"
          )
        );
      }

      if (payload?.key !== keyJWT.REGISTER) {
        return next(
          new NotAuthorizedError(
            req.t("modules.auth.register.create.error"),
            "KEY_INVALID"
          )
        );
      }

      if (status === TokenStatus.TOKEN_VALID && payload?.email) {
        const emailExists = await userService
          .checkEmailExist(payload?.email)
          .catch((error) => {
            logError("register", "Check email exist error", error);
            return next(parseMongoError(error));
          });

        if (emailExists) {
          return next(
            new BadRequestError(
              req.t("modules.auth.register.create.email-exist"),
              "EMAIL_ALREADY_EXISTS"
            )
          );
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await userService
          .createUser({
            email: payload.email,
            fullname: fullname,
            password: hashedPassword,
            id_role: "687f8f3ca0a68816cca9e4f7",
            status: statusAccount.VERIFIED,
            type: "EMAIL",
          })
          .catch((error) => {
            logError("register", "Create user error", error);
            return next(parseMongoError(error));
          });

        return res.status(201).json({
          message: req.t("modules.auth.register.create.success"),
        });
      }
    } catch (error) {
      logError("register", "Create user failed", error);
      return next(new ServerError(req.t("modules.auth.register.create.error")));
    }
  }
}
