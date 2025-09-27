import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { config } from "@/config.app";

import { logError } from "../../../shared/utils/log";
import { userService } from "@/modules/user/service/user.service";
import { s3Service } from "@/modules/s3/service/s3.service";
import { PermissionType } from "@/modules/user/schemes/user.model";
import type { ReqBodySession } from "@/shared/middleware/auth.middleware";

export const isLimitUploadMiddleware = (sizeNameHeader?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = JSON.parse(
        req.headers["session"] as string
      ) as ReqBodySession;
      const sizeFileUpload = Number(req.headers[sizeNameHeader || "size"]);
      // console.log("req.header", req.headers);

      const permissions = await userService.getPermissionById(session.id_user);
      if (
        !permissions ||
        !permissions.some(
          (permission: any) => permission.name === PermissionType.UPLOAD_FILE
        )
      ) {
        return next(new ServerError(req.t("server.error")));
      }

      const listTotalSize = await s3Service.getSizeByAuthor(session.id_user);
      //-------------------------------------------------------------
      const limitSizeSystem = Number(
        permissions.find(
          (permission: any) => permission.name === PermissionType.UPLOAD_FILE
        )?.limit
      );
      if (!limitSizeSystem) {
        return next(new ServerError(req.t("server.error")));
      }
      const sizeUsed = listTotalSize ? Number(listTotalSize[0]?.totalSize) : 0;

      // console.log("sizeUsed", sizeUsed);
      // console.log("limitSizeSystem", limitSizeSystem);
      // console.log("sizeFileUpload", sizeFileUpload);
      //   console.log("check", sizeUsed + sizeFileUpload > limitSizeSystem);
      if (isNaN(sizeUsed) || isNaN(limitSizeSystem)) {
        return next(new ServerError(req.t("server.error")));
      }
      if (sizeUsed + (sizeFileUpload || 0) > limitSizeSystem) {
        return next(
          new BadRequestError(
            req.t("modules.s3.upload-limit-exceeded"),
            "LIMIT_SIZE_UPLOAD_FILE"
          )
        );
      }
      //   console.log("listTotalSize", listTotalSize);
      //   console.log("permission", permissions);
      next();
    } catch (error) {
      logError("isLimitUpload.middleware", "isLimitUpload fail", error);
      return next(new ServerError(req.t("server.error")));
    }
  };
};
