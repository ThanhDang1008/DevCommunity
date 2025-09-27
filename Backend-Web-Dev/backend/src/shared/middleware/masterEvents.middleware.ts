import { NextFunction } from "express";
import { Socket } from "socket.io";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { config } from "@/config.app";
import i18n from "@/shared/utils/language/i18n";

export const masterEventsMiddleware = async (
  socket: Socket,
  next: NextFunction
) => {
  // console.log("allowedRoles", allowedRoles);

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

  console.log("token event", token);

  if (!token) {
    return next(
      new NotAuthorizedError(i18n.__("server.unauthorized"), "KEY_REQUIRED")
    );
  }

  if (token !== config.KEY_MASTER) {
    return next(
      new NotAuthorizedError(i18n.__("server.unauthorized"), "UNAUTHORIZED")
    );
  }
  return next();
};
