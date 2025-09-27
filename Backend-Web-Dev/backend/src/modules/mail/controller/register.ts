import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";

import { config } from "@/config.app";
import { IResetPassword } from "../interfaces/mail.interface";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { logError } from "@/shared/utils/log";
import { RegisterTemplate } from "../template/register";
import { generateToken } from "@/shared/globals/helpers/jwt.auth";
import { keyJWT } from "@/constants/common";
import { userService } from "@/modules/user/service/user.service";

export class Register {
  public async send(
    req: Request<{}, {}, IResetPassword>,
    res: Response,
    next: NextFunction
  ) {
    const { email, name, url_service, name_service } = req.body;

    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!name) missingFields.push("name");
    if (!url_service) missingFields.push("url_service");
    if (!name_service) missingFields.push("name_service");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Gửi email thất bại, thiếu trường: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const emailExists = await userService.checkEmailExist(email);
      if (emailExists) {
        return next(
          new BadRequestError(
            req.t("modules.mail.send-register-email.exist"),
            "EMAIL_ALREADY_EXISTS"
          )
        );
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASS,
        },
      });

      const payload = {
        email: email,
        key: keyJWT.REGISTER,
      };
      const token = generateToken(payload, "300s");

      const mailOptions = RegisterTemplate({
        email_user: email,
        url_register: `${url_service}/auth/register?token=${token}`,
        email_support: config.EMAIL_USER || "",
        name_service: name_service,
        name_user: name,
        time_expire: "5 phút",
      });
      const response = await transporter.sendMail(mailOptions);
      return res.status(200).json({
        message: req.t("modules.mail.send-register-email.success"),
      });
    } catch (error) {
      logError("send-register-email", "Gửi email đăng ký thất bại", error);
      return next(
        new ServerError(req.t("modules.mail.send-register-email.error"))
      );
    }
  }
}
