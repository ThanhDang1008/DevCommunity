import { Request, Response, NextFunction } from "express";

import { roleService } from "../service/role.service";
import { logError } from "@/shared/utils/log";
import {
  ServerError,
} from "@/shared/globals/exceptions/error-handler";

export class GetRole {
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await roleService.getAll();

      if (!roles || roles.length === 0) {
        return res.status(404).json({
          message: req.t("modules.role.get-all.not-found"),
          data: [],
        });
      }

      return res.status(200).json({
        message: req.t("modules.role.get-all.success"),
        data: roles,
      });
      
    } catch (error) {
      logError("create-role", "create role fail", error);
      return next(new ServerError(req.t("modules.role.get-all.error")));
    }
  }
}
