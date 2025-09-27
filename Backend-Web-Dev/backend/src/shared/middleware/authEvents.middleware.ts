import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";
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
import i18n from "@/shared/utils/language/i18n";

export type ReqBodySession = {
  email: string;
  id_user: string;
  session_id: string;
  id_role: IRole;
};

export const authEventsMiddleware = async (
  socket: Socket,
  allowedRoles: Role[],
  next: NextFunction
) => {
  // console.log("allowedRoles", allowedRoles);
  try {
    const getCookie = (
      name_cookie: string,
      cookie: string | undefined
    ): string | undefined => {
      if (!cookie) return undefined;
      const match = cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${name_cookie}=`));
      return match ? match.replace(`${name_cookie}=`, "") : undefined;
    };

    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.replace("Bearer ", "") ||
      getCookie(config.COOKIE_NAME_AUTH, socket.handshake.headers.cookie) ||
      getCookie("token", socket.handshake.headers.cookie);

    // console.log("token", token);
    // console.log("req.cookies", req.cookies);
    // if (req.headers["session"]) {
    //   return next(
    //     new NotAuthorizedError(
    //       req.t("server.forbidden"),
    //       "SESSION_NOT_ALLOWED"
    //     )
    //   );
    // }

    if (!token) {
      return next(
        new NotAuthorizedError(i18n.__("server.unauthorized"), "TOKEN_REQUIRED")
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
        new NotAuthorizedError(i18n.__("server.unauthorized"), "TOKEN_INVALID")
      );
    }

    if (status === TokenStatus.TOKEN_EXPIRED) {
      return next(
        new NotAuthorizedError(i18n.__("server.unauthorized"), "TOKEN_EXPIRED")
      );
    }

    if (payload?.key !== keyJWT.SESSION) {
      return next(
        new NotAuthorizedError(i18n.__("server.unauthorized"), "KEY_INVALID")
      );
    }

    if (status === TokenStatus.TOKEN_VALID && payload?.session_id) {
      const data = await sessionService
        .getSessionByKey(payload?.session_id)
        .catch((error) => {
          return next(
            new ServerError(i18n.__("server.error"), "GET_DATA_USER_ERROR")
          );
        });

      if (data) {
        const dataUser = await userService
          .getAuthById(data?.id_user)
          .catch((error) => {
            return next(
              new ServerError(i18n.__("server.error"), "GET_DATA_USER_ERROR")
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
              i18n.__("server.unauthorized"),
              "ROLE_NOT_FOUND"
            )
          );
        }

        //console.log("dataRoleUser", dataRoleUser);

        const nameRole = dataUser.role.role;
        if (allowedRoles.includes(nameRole)) {
          // req.headers["session"] = JSON.stringify({
          //   email: data?.email,
          //   id_user: data?.id_user,
          //   session_id: data?.session_id,
          //   id_role: dataUser.role,
          // });
          return next();
        } else {
          return next(
            new NotAuthorizedError(
              i18n.__("server.unauthorized"),
              "UNAUTHORIZED"
            )
          );
        }
      }
      return next(
        new NotAuthorizedError(
          i18n.__("server.unauthorized"),
          // "TOKEN_VALID"
          "SESSION_DB_NOT_FOUND"
        )
      );
    }
  } catch (error) {
    logError("authEvents.middleware", "auth fail", error);
    return next(
      new ServerError(i18n.__("server.error"), "INTERNAL_SERVER_ERROR")
    );
  }
};
