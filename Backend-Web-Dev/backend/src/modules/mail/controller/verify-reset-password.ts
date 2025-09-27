import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  ServerError,
  NotAuthorizedError,
} from "@/shared/globals/exceptions/error-handler";
import { logError } from "@/shared/utils/log";
import { verifyToken, TokenStatus } from "@/shared/globals/helpers/jwt.auth";
import { keyJWT } from "@/constants/common";
import { userService } from "@/modules/user/service/user.service";
import { hashPassword } from "@/modules/auth/utils/auth.util";
import { sessionService } from "@/modules/session/service/session.service";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

export class VerifyResetPassword {
  public async execute(req: Request, res: Response, next: NextFunction) {
    try {
      const { new_password, token } = req.body;
      const missingFields = [];
      if (!new_password) missingFields.push("new_password");
      if (!token) missingFields.push("token");
      if (missingFields.length > 0) {
        return next(
          new BadRequestError(
            `Verify reset password fail, missing fields: ${missingFields.join(
              ", "
            )}`,
            "MISSING_FIELDS"
          )
        );
      }

      type Payload = {
        email: string;
        key: string;
        iat: number;
        exp: number;
      };

      const { status, payload } = verifyToken<Payload>(token);

      if (status === TokenStatus.TOKEN_INVALID) {
        return next(
          new NotAuthorizedError("Thay đổi mật khẩu thất bại", "TOKEN_INVALID")
        );
      }

      if (status === TokenStatus.TOKEN_EXPIRED) {
        return next(
          new NotAuthorizedError("Thay đổi mật khẩu thất bại", "TOKEN_EXPIRED")
        );
      }

      if (payload?.key !== keyJWT.RESET_PASSWORD) {
        return next(
          new NotAuthorizedError("Thay đổi mật khẩu thất bại", "KEY_INVALID")
        );
      }

      if (status === TokenStatus.TOKEN_VALID && payload?.email) {
        const IsUser = await userService
          .checkEmailExist(payload?.email)
          .catch((error) => {
            logError("verify-reset-password", "Check email exist error", error);
            return next(parseMongoError(error));
          });
        if (!IsUser) {
          return next(
            new NotAuthorizedError(
              "Thay đổi mật khẩu thất bại",
              "USER_NOT_FOUND"
            )
          );
        }
        const hashedPassword = await hashPassword(new_password);
        const updatePassword = await userService.updatePasswordByEmail(
          payload?.email,
          hashedPassword
        );
        if (!updatePassword) {
          return next(
            new ServerError(
              "Thay đổi mật khẩu thất bại",
              "UPDATE_PASSWORD_ERROR"
            )
          );
        }
        await sessionService.deleteSessionByEmail(payload?.email);
        return res.status(200).json({
          message: "Thay đổi mật khẩu thành công",
          status: "RESET_PASSWORD_SUCCESS",
        });
      }
    } catch (error) {
      logError("verify-reset-password", "verify reset password fail", error);
      return next(
        new ServerError(
          "Verify reset password fail",
          "VERIFY_RESET_PASSWORD_ERROR"
        )
      );
    }
  }
}
