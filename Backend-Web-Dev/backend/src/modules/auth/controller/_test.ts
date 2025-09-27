import { Request, Response, NextFunction } from "express";

import { authService } from "@/modules/auth/service/auth.service";
import { config } from "@/config.app";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";

export class Test {
  public async read(req: Request, res: Response, next: NextFunction) {
  }
}
