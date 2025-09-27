import { Request, Response, NextFunction } from "express";

import { sessionService } from "@/modules/session/service/session.service";
import { config } from "@/config.app";
import { verifyToken, TokenStatus } from "@/shared/globals/helpers/jwt.auth";
import {
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { keyJWT } from "@/constants/common";
import { userService } from "@/modules/user/service/user.service";
import type { ISessionUserClient } from "@/modules/session/interfaces/session.interface";
import { statusAccount } from "@/constants/common";

export class GetDataUser {
  public async read(req: Request, res: Response, next: NextFunction) {
    const name_cookie = config.COOKIE_NAME_AUTH;
    const token =
      req.cookies[name_cookie] ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return next(
        new NotAuthorizedError(
          "You are not authorized to access this resource",
          "TOKEN_NOT_FOUND"
        )
      );
    }

    type Payload = {
      session_id: string;
      key: string;
      iat: number;
      exp: number;
    };

    const { status, payload } = verifyToken<Payload>(token);

    if (status === TokenStatus.TOKEN_INVALID) {
      return next(
        new NotAuthorizedError(
          "You are not authorized to access this resource",
          "TOKEN_INVALID"
        )
      );
    }

    if (status === TokenStatus.TOKEN_EXPIRED) {
      return next(
        new NotAuthorizedError(
          "You are not authorized to access this resource",
          "TOKEN_EXPIRED"
        )
      );
    }

    if (payload?.key !== keyJWT.SESSION) {
      return next(
        new NotAuthorizedError(
          "You are not authorized to access this resource",
          "KEY_INVALID"
        )
      );
    }

    if (status === TokenStatus.TOKEN_VALID && payload?.session_id) {
      const data = await sessionService
        .getSessionByKey(payload?.session_id)
        .catch((error) => {
          return next(
            new ServerError("Get session user failed", "GET_SESSION_USER_ERROR")
          );
        });

      if (data) {
        const dataUser = await userService
          .getAuthById(data?.id_user)
          .catch((error) => {
            return next(
              new ServerError("Get data user failed", "GET_DATA_USER_ERROR")
            );
          });

       // console.log("get data user", dataUser);

        if (
          !dataUser ||
          !dataUser.role ||
          typeof dataUser.role !== "object" ||
          !("_id" in dataUser.role) ||
          !("role" in dataUser.role)
        ) {
          return next(
            new NotAuthorizedError("You are not authorized", "ROLE_NOT_FOUND")
          );
        }

        // console.log("get data user dataRoleUser", dataRoleUser);

        const dataClient: ISessionUserClient = {
          email: data?.email,
          id_user: data?.id_user,
          session_id: data?.session_id,
          id_role: {
            _id: dataUser?.role?._id,
            role: dataUser?.role?.role,
          },
        };
        return res.status(200).json(dataClient);
      }
      return next(
        new NotAuthorizedError(
          "You are not authorized to access this resource",
          // "TOKEN_VALID"
          "SESSION_DB_NOT_FOUND"
        )
      );
    }
  }
}
