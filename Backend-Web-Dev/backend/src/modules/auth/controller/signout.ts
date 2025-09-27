import { Request, Response, NextFunction } from "express";

import { sessionService } from "@/modules/session/service/session.service";
import { config } from "@/config.app";
import {
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { ReqBodySession } from "@/shared/middleware/auth.middleware";
import { logError } from "@/shared/utils/log";

export class SignOut {
  public async update(req: Request, res: Response, next: NextFunction) {
    const name_cookie = config.COOKIE_NAME_AUTH;
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqBodySession;

    try {
      const data = await sessionService
        .deleteSessionByKey(session.session_id)
        .catch((error) => {
          return next(new ServerError("Đăng xuất thất bại", "SIGNOUT_ERROR"));
        });

      res.clearCookie(name_cookie);

      return res.status(200).json({
        message: "Đăng xuất thành công",
        status: "SIGNOUT_SUCCESS",
      });
    } catch (error) {
      logError("signout", "update fail", error);
      return next(
        new ServerError("Đăng xuất thất bại", "INTERNAL_SERVER_ERROR")
      );
    }
  }
}
