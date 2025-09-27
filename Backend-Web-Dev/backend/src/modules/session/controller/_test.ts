import { Request, Response, NextFunction } from "express";

import { sessionService } from "../service/session.service";
import {
  ServerError,
  BadRequestError,
} from "@/shared/globals/exceptions/error-handler";

export class Test {
  public async create(req: Request, res: Response, next: NextFunction) {
    

    try {
     
    } catch (error) {
      next(new ServerError("Internal Server Error", "SERVER_ERROR"));
    }
  }
}
