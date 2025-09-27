import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { config } from "@/config.app";
import { sessionService } from "@/modules/session/service/session.service";
import { verifyToken, TokenStatus } from "@/shared/globals/helpers/jwt.auth";
import { Role, keyJWT } from "@/constants/common";
import { logError } from "../utils/log";
import { userService } from "@/modules/user/service/user.service";
import type { IRole } from "@/modules/role/schemes/role.model";

export type ReqBodySession = {
  email: string;
  id_user: string;
  session_id: string;
  id_role: IRole;
};

export const authAuthMiddleware = (allowedRoles: Role[]) => {
  // console.log("allowedRoles", allowedRoles);
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name_cookie = config.COOKIE_NAME_AUTH;

      const token =
        req.cookies[name_cookie] ||
        req.cookies["token"] ||
        req.headers["authorization"]?.replace("Bearer ", "");

      // console.log("token", token);
      // console.log("req.cookies", req.cookies);
      if (req.headers["session"]) {
        return next(
          new NotAuthorizedError(
            req.t("server.forbidden"),
            "SESSION_NOT_ALLOWED"
          )
        );
      }

      if (!token) {
        return next(
          new NotAuthorizedError(req.t("server.unauthorized"), "TOKEN_REQUIRED")
        );
      }

      type Payload = {
        session_id: string;
        key: string;
        iat: number;
        exp: number;
      };

      const { status, payload } = verifyToken<Payload>(token);

      // console.log("status", status);
      // console.log("payload", payload);

      if (status === TokenStatus.TOKEN_INVALID) {
        return next(
          new NotAuthorizedError(req.t("server.unauthorized"), "TOKEN_INVALID")
        );
      }

      if (status === TokenStatus.TOKEN_EXPIRED) {
        return next(
          new NotAuthorizedError(req.t("server.unauthorized"), "TOKEN_EXPIRED")
        );
      }

      if (payload?.key !== keyJWT.SESSION) {
        return next(
          new NotAuthorizedError(req.t("server.unauthorized"), "KEY_INVALID")
        );
      }

      if (status === TokenStatus.TOKEN_VALID && payload?.session_id) {
        const data = await sessionService
          .getSessionByKey(payload?.session_id)
          .catch((error) => {
            return next(
              new ServerError(req.t("server.error"), "GET_DATA_USER_ERROR")
            );
          });

        if (data) {
          const dataUser = await userService
            .getAuthById(data?.id_user)
            .catch((error) => {
              return next(
                new ServerError(req.t("server.error"), "GET_DATA_USER_ERROR")
              );
            });

          if (
            !dataUser ||
            !dataUser.role ||
            typeof dataUser.role !== "object" ||
            !("_id" in dataUser.role) ||
            !("role" in dataUser.role)
          ) {
            return next(
              new NotAuthorizedError(
                req.t("server.unauthorized"),
                "ROLE_NOT_FOUND"
              )
            );
          }

          //console.log("dataRoleUser", dataRoleUser);

          const nameRole = dataUser.role.role
          if (allowedRoles.includes(nameRole)) {
            req.headers["session"] = JSON.stringify({
              email: data?.email,
              id_user: data?.id_user,
              session_id: data?.session_id,
              id_role: dataUser.role,
            });
            return next();
          } else {
            return next(
              new NotAuthorizedError(
                req.t("server.unauthorized"),
                "UNAUTHORIZED"
              )
            );
          }
        }
        return next(
          new NotAuthorizedError(
            req.t("server.unauthorized"),
            // "TOKEN_VALID"
            "SESSION_DB_NOT_FOUND"
          )
        );
      }
    } catch (error) {
      logError("auth.middleware", "auth fail", error);
      return next(
        new ServerError(req.t("server.error"), "INTERNAL_SERVER_ERROR")
      );
    }
  };
};
