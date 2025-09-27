import { Request, Response, NextFunction } from "express";
import {
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";

import { logError } from "../utils/log";
import {
  verifySignature as verifySignatureClient,
  TokenStatus,
} from "@/shared/globals/helpers/jwt.signature";

export const verifySignature = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers["x-signature"] as string;

      if (!signature) {
        return next(
          new NotAuthorizedError(
            req.t("server.unauthorized"),
            "SIGNATURE_REQUIRED"
          )
        );
      }

      const { status } = verifySignatureClient(signature);

      if (status === TokenStatus.TOKEN_INVALID) {
        return next(
          new NotAuthorizedError(
            req.t("server.unauthorized"),
            "SIGNATURE_INVALID"
          )
        );
      }

      if (status === TokenStatus.TOKEN_EXPIRED) {
        return next(
          new NotAuthorizedError(
            req.t("server.unauthorized"),
            "SIGNATURE_EXPIRED"
          )
        );
      }

      if (status === TokenStatus.TOKEN_VALID) {
        next();
      }
    } catch (error) {
      logError("verifySignature.middleware", "verifySignature fail", error);
      return next(
        new ServerError(req.t("server.error"), "INTERNAL_SERVER_ERROR")
      );
    }
  };
};
