import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenStatus } from "@/shared/globals/helpers/jwt.auth";
import { IPayloadMailVerify } from "../interfaces/mail.interface";
import { mailService } from "../service/mail.service";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";

export class VerifyRegistrationMail {
  public async execute(req: Request, res: Response, next: NextFunction) {
    const { token } = req.query;
    if (!token) {
      return next(
        new BadRequestError("Email verification failed", "TOKEN_NOT_FOUND")
      );
    }

    const { status, payload } = verifyToken<IPayloadMailVerify>(
      token as string
    );
    if (status === TokenStatus.TOKEN_VALID && payload?.isVerify === true) {
      const res_service = await mailService.verifyAccount(payload.email);
      //console.log("res_service", res_service);
      return res.status(200).json({
        message: "Email verification success",
        status: "EMAIL_VERIFY_SUCCESS",
      });
    } else if (status === TokenStatus.TOKEN_EXPIRED) {
      return next(
        new NotAuthorizedError("Email verification failed", "TOKEN_EXPIRED")
      );
    } else if (status === TokenStatus.TOKEN_INVALID) {
      return next(
        new NotAuthorizedError("Email verification failed", "TOKEN_INVALID")
      );
    }
  }
}
