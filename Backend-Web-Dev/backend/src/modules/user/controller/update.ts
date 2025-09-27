import { Request, Response, NextFunction } from "express";

import { userService } from "@/modules/user/service/user.service";
import { config } from "@/config.app";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import type { ReqBodySession } from "@/shared/middleware/auth.middleware";
import { logError } from "@/shared/utils/log";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

export class UpdateUser {
  public async info(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqBodySession;
    //console.log("session", session);

    const { data } = req.body;
    const missingFields = [];
    if (!data) missingFields.push("data");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Cập nhật thông tin thất bại, thiếu các trường: ${missingFields.join(
            ", "
          )}`,
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const user = await userService
        .updateUser(session.id_user, data)
        .catch((error) => {
          logError("update-user", "info error", error);
          return next(parseMongoError(error));
        });

      if (!user) {
        return next(
          new BadRequestError("Cập nhật thông tin thất bại", "UPDATE_USER_FAIL")
        );
      }

      return res.status(200).json({
        message: "Cập nhật thông tin thành công",
      });
    } catch (error) {
      logError("update-user", "info fail", error);
      return next(
        new ServerError("Cập nhật thông tin thất bại", "INTERNAL_SERVER_ERROR")
      );
    }
  }

  public async setInfo(req: Request, res: Response, next: NextFunction) {
    const {
      id_user,
      fullname,
      email,
      password,
      status,
      id_role,
      avatar,
      type,
    } = req.body;
    const missingFields = [];
    if (!id_user) missingFields.push("id_user");
    // if (!fullname) missingFields.push("fullname");
    // if (!email) missingFields.push("email");
    // if (!password) missingFields.push("password");
    // if (!status) missingFields.push("status");
    // if (!id_role) missingFields.push("id_role");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter"),
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const objectData: Record<string, any> = {};
      if (fullname) objectData["fullname"] = fullname;
      if (email) objectData["email"] = email;
      if (password) objectData["password"] = password;
      if (status) objectData["status"] = status;
      if (id_role) objectData["id_role"] = id_role;
      if (avatar) objectData["avatar"] = avatar;
      if (type) objectData["type"] = type;

      const user = await userService
        .setInfo(id_user, objectData)
        .catch((error) => {
          logError("update-user", "setInfo error", error);
          return next(
            new ServerError(
              req.t("modules.user.set-info.error"),
              "SET_INFO_ERROR"
            )
          );
        });

      if (!user) {
        return next(
          new BadRequestError(
            req.t("modules.user.set-info.error"),
            "UPDATE_USER_FAIL"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.user.set-info.success"),
      });
    } catch (error) {
      logError("update-user", "setInfo fail", error);
      return next(new ServerError(req.t("modules.user.set-info.error")));
    }
  }
}
