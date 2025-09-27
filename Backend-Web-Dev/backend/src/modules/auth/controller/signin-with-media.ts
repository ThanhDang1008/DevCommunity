import { Request, Response, NextFunction } from "express";

import { userService } from "@/modules/user/service/user.service";
import { roleService } from "@/modules/role/service/role.service";
import { sessionService } from "@/modules/session/service/session.service";

import { config } from "@/config.app";
import { hashPassword } from "../utils/auth.util";
import { generateToken } from "@/shared/globals/helpers/jwt.auth";
import { statusAccount, keyJWT, Role } from "@/constants/common";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import type { ISessionUserClient } from "@/modules/session/interfaces/session.interface";

export class SignInWithMedia {
  public async exec(req: Request, res: Response, next: NextFunction) {
    const { email, fullname, type, avatar } = req.body;

    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!fullname) missingFields.push("fullname");
    if (!type) missingFields.push("type");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Signin fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const existingUser = await userService.getUserByEmail(email);

      if (existingUser) {
        //session id
        const session_id =
          "session-" + Date.now() + "-" + Math.round(Math.random() * 1e9);

        const data_session: ISessionUserClient = {
          email: existingUser?.email,
          id_user: existingUser?._id,
          session_id: session_id,
          id_role: {
            _id: existingUser?.id_role._id,
            role: existingUser?.id_role.role,
          },
        };

        //generate token
        const payload = { session_id: session_id, key: keyJWT.SESSION };
        const token = generateToken(payload, config.JWT_EXPIRES_AUTH);

        //set cookie
        // const name_cookie = config.COOKIE_NAME_AUTH;
        // res.cookie(name_cookie, token, {
        //   httpOnly: true,
        //   maxAge: Number(config.COOKIE_EXPIRES_IN), //đơn vị là ms
        // });

        //save session
        const session = await sessionService
          .createSession(session_id, {
            id_user: existingUser?._id,
            email: existingUser?.email,
          })
          .catch((err) => {
            return next(
              new ServerError("Đã xảy ra lỗi", "CREATE_SESSION_ERROR")
            );
          });
        if (!session) {
          return next(new ServerError("Đã xảy ra lỗi", "CREATE_SESSION_ERROR"));
        }

        //set cookie
        const name_cookie = config.COOKIE_NAME_AUTH;
        res.cookie(name_cookie, token, {
          httpOnly: true,
          maxAge: Number(config.COOKIE_EXPIRES_IN), //đơn vị là ms
          secure: config.NODE_ENV === "production" ? true : false, // Bắt buộc khi dùng SameSite: 'none'
          //sameSite: "none", // Cho phép gửi cookie qua cross-site request
          path: "/", // Cookie dùng cho toàn bộ ứng dụng
          priority: "high", // Đặt độ ưu tiên cho cookie
        });

        return res.status(200).json({
          message: "Đăng nhập thành công",
          data: data_session,
          token: token,
        });
      }
      if (!existingUser) {
        //----------------- tạo mới tài khoản -----------------
        const existingRole = await roleService
          .getRoleByName(Role.USER)
          .catch((err) => {
            //không tìm thấy role
            return next(new BadRequestError("Signin fail", "ROLE_NOT_FOUND"));
          });
        if (!existingRole) {
          return next(new BadRequestError("Signin fail", "ROLE_NOT_FOUND"));
        }

        const hashedPassword = await hashPassword(email);
        const newUser = await userService.createUser({
          id_role: existingRole?.id,
          fullname,
          password: hashedPassword,
          email,
          status: statusAccount.VERIFIED,
          type: type,
          avatar: avatar,
        });
        if (!newUser) {
          return next(new ServerError("Đã xảy ra lỗi", "CREATE_USER_ERROR"));
        }
        //----------------------------------

        //----------------- tạo phiên -----------------
        const existingUser = await userService.getUserByEmail(newUser?.email);

        //session id
        const session_id =
          "session-" + Date.now() + "-" + Math.round(Math.random() * 1e9);

        const data_session: ISessionUserClient = {
          email: existingUser?.email,
          id_user: existingUser?._id,
          session_id: session_id,
          id_role: {
            _id: existingUser?.id_role._id,
            role: existingUser?.id_role.role,
          },
        };

        //generate token
        const payload = { session_id: session_id, key: keyJWT.SESSION };
        const token = generateToken(payload, config.JWT_EXPIRES_AUTH);

        //set cookie
        // const name_cookie = config.COOKIE_NAME_AUTH;
        // res.cookie(name_cookie, token, {
        //   httpOnly: true,
        //   maxAge: Number(config.COOKIE_EXPIRES_IN), //đơn vị là ms
        // });

        //save session
        const session = await sessionService
          .createSession(session_id, {
            id_user: existingUser?._id,
            email: existingUser?.email,
          })
          .catch((err) => {
            return next(
              new ServerError("Đã xảy ra lỗi", "CREATE_SESSION_ERROR")
            );
          });
        //----------------------------------
        if (!session) {
          return next(new ServerError("Đã xảy ra lỗi", "CREATE_SESSION_ERROR"));
        }

        //set cookie
        const name_cookie = config.COOKIE_NAME_AUTH;
        res.cookie(name_cookie, token, {
          httpOnly: true,
          maxAge: Number(config.COOKIE_EXPIRES_IN), //đơn vị là ms
          secure: config.NODE_ENV === "production" ? true : false, // Bắt buộc khi dùng SameSite: 'none'
          //sameSite: "none", // Cho phép gửi cookie qua cross-site request
          path: "/", // Cookie dùng cho toàn bộ ứng dụng
          priority: "high", // Đặt độ ưu tiên cho cookie
        });

        return res.status(200).json({
          message: "Đăng nhập thành công",
          data: data_session,
          token: token,
        });
      }
    } catch (error) {
      return next(new ServerError("Đã xảy ra lỗi", "INTERNAL_SERVER_ERROR"));
    }
  }
}
