import { Request, Response, NextFunction } from "express";
import { ISendMailVerify } from "../interfaces/mail.interface";
import { config } from "@/config.app";
import nodemailer from "nodemailer";
import { configMailOptions } from "../template/_verify-user";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";

export class SendMailVerify {
  public async execute(
    req: Request<{}, {}, ISendMailVerify>,
    res: Response,
    next: NextFunction
  ) {
    const data = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });

    const mailOptions = configMailOptions({
      name_project: data.name_project,
      email_project: data.email_project,
      name_user: data.name_user,
      email_user: data.email_user,
      url_verify: data.url_verify,
      url_contact: data.url_contact,
      url_feedback: data.url_feedback,
    });

    try {
      const res_mail = await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: "Email sent success!",
        status: "SEND_EMAIL_SUCCESS",
        data: res_mail,
      });
    } catch (error) {
      return next(new ServerError("Error sending email", "SEND_EMAIL_ERROR"));
    }
  }
}
