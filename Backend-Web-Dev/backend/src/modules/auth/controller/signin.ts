import { Request, Response, NextFunction } from "express";

import { userService } from "@/modules/user/service/user.service";
import { sessionService } from "@/modules/session/service/session.service";
import { config } from "@/config.app";
import { comparePassword } from "../utils/auth.util";
import { generateToken } from "@/shared/globals/helpers/jwt.auth";
import { statusAccount, keyJWT } from "@/constants/common";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import type { ISessionUserClient } from "@/modules/session/interfaces/session.interface";

export class SignIn {
  public async read(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    //console.log("req.body", req.body);

    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Signin fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    const existingUser = await userService.getUserByEmail(email);
    //console.log("existingUser", existingUser);

    if (!existingUser) {
      return next(
        new BadRequestError(
          "Email hoặc mật khẩu không chính xác",
          "EMAIL_OR_PASSWORD_INCORRECT"
        )
      );
    }

    const passwordsMatch: boolean = await comparePassword(
      password,
      existingUser?.password
    );

    if (!passwordsMatch) {
      return next(
        new BadRequestError(
          "Email hoặc mật khẩu không chính xác",
          "EMAIL_OR_PASSWORD_INCORRECT"
        )
      );
    }

    if (passwordsMatch && existingUser?.status !== statusAccount.VERIFIED) {
      return res.status(401).json({
        message: "Tài khoản chưa được xác thực",
        status: "ACCOUNT_NOT_VERIFIED",
        data: {
          fullname: existingUser?.fullname,
          email: existingUser?.email,
          status: existingUser?.status,
        },
      });
    }

    if (
      passwordsMatch &&
      existingUser?._id &&
      existingUser?.status === statusAccount.VERIFIED &&
      existingUser?.id_role
    ) {
      //session id
      const session_id =
        "session-" + Date.now() + "-" + Math.round(Math.random() * 1e9);

      const data_session: ISessionUserClient = {
        email: existingUser?.email,
        id_user: existingUser?._id,
        session_id: session_id,
        id_role: {
          _id: existingUser?.id_role?._id,
          role: existingUser?.id_role?.role,
        },
      };

     // console.log("data_session", data_session);

      //generate token
      const payload = { session_id: session_id, key: keyJWT.SESSION };
      const token = generateToken(payload, config.JWT_EXPIRES_AUTH);

      //save session
      const session = await sessionService
        .createSession(
          session_id,
          {
            id_user: existingUser?._id,
            email: existingUser?.email,
          },
          token
        )
        .catch((err) => {
          return next(new ServerError("Đã xảy ra lỗi", "CREATE_SESSION_ERROR"));
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
        sameSite: "lax", // Cho phép gửi cookie qua cross-site request
        path: "/", // Cookie dùng cho toàn bộ ứng dụng
        priority: "high", // Đặt độ ưu tiên cho cookie
      });

      return res.status(200).json({
        message: "Đăng nhập thành công",
        data: data_session,
        token: token,
      });
    }

    return next(new ServerError("Đã xảy ra lỗi", "INTERNAL_SERVER_ERROR"));
  }
}
