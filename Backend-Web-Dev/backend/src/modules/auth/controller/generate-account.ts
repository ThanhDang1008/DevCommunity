import { Request, Response, NextFunction } from "express";

import { roleService } from "@/modules/role/service/role.service";
import { userService } from "@/modules/user/service/user.service";
import { hashPassword } from "../utils/auth.util";
import { statusAccount } from "@/constants/common";
import { logError } from "@/shared/utils/log";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";

export class GenerateAccount {
  public async create(req: Request, res: Response, next: NextFunction) {
    const { id_role, fullname, password, email } = req.body;
    const missingFields = [];
    if (!id_role) missingFields.push("id_role");
    if (!fullname) missingFields.push("fullname");
    if (!password) missingFields.push("password");
    if (!email) missingFields.push("email");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Generate account fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }
    const existingRole = await roleService.getRoleById(id_role).catch((err) => {
      //không tìm thấy role
      return next(
        new BadRequestError("Generate account fail", "ROLE_NOT_FOUND")
      );
    });
    try {
      const hashedPassword = await hashPassword(password);
      const newUser = await userService.createUser({
        id_role,
        fullname,
        password: hashedPassword,
        email,
        status: statusAccount.VERIFIED,
      });
      return res.status(201).json({
        message: "Generate account success",
        data: {
          email: newUser?.email,
          role: existingRole?.role,
          status: newUser?.status,
        },
      });
    } catch (error) {
      logError("generate-account", "generate account fail", error);
      return next(
        new ServerError("Generate account fail", "GENERATE_ACCOUNT_ERROR")
      );
    }
  }
}
