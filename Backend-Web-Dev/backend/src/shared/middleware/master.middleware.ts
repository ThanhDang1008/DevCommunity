import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
  FileTooLargeError,
} from "@/shared/globals/exceptions/error-handler";
import { config } from "@/config.app";

export const masterAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    return next(
      new NotAuthorizedError(req.t("server.unauthorized"), "KEY_REQUIRED")
    );
  }

  if (token !== config.KEY_MASTER) {
    return next(
      new NotAuthorizedError(req.t("server.unauthorized"), "UNAUTHORIZED")
    );
  }
  return next();
};
