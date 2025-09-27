import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import { ServerError } from "@/shared/globals/exceptions/error-handler";
import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";
import { config } from "@/config.app";

export class Version {
  public async info(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        message: "Version fetched success",
        data: {
          buildTime: formatToLocalDateTime(new Date().toISOString()),
          // commitHash: process.env.COMMIT_HASH || "unknown",
          info: `Cập nhật lần cuối vào lúc 00:45 02/08/2025`,
          environment: config.NODE_ENV,
        },
      });
    } catch (error) {
      logError("version", "get version fail", error);
      return next(
        new ServerError("Error get version", "INTERNAL_SERVER_ERROR")
      );
    }
  }
}
