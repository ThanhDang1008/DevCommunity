import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";

import { config } from "@/config.app";
import { IResetPassword } from "../interfaces/mail.interface";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { logError } from "@/shared/utils/log";
import { ResetPasswordTemplate } from "../template/reset-password";
import { generateToken } from "@/shared/globals/helpers/jwt.auth";
import { keyJWT } from "@/constants/common";

export class ResetPassword {
  public async send(
    req: Request<{}, {}, IResetPassword>,
    res: Response,
    next: NextFunction
  ) {
    const data = req.body;

    const missingFields = [];
    if (!data.email) missingFields.push("email");
    if (!data.name) missingFields.push("name");
    if (!data.url_service) missingFields.push("url_service");
    if (!data.name_service) missingFields.push("name_service");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Gửi email thất bại, thiếu trường: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
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
      email: data.email,
      key: keyJWT.RESET_PASSWORD,
    };
    const token = generateToken(payload, "300s");

    const mailOptions = ResetPasswordTemplate({
      email_user: data.email,
      url_reset_password: `${data.url_service}/auth/reset-password?token=${token}`,
      email_support: config.EMAIL_USER || "",
      name_service: data.name_service,
      name_user: data.name,
      time_expire: "5 phút",
    });

    try {
      const response = await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: req.t("modules.mail.send-reset-password-email.success"),
      });
    } catch (error) {
      logError("reset-password", "send mail reset password error", error);
      return next(
        new ServerError(req.t("modules.mail.send-reset-password-email.error"))
      );
    }
  }
}
