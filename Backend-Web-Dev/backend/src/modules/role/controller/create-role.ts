import { Request, Response, NextFunction } from "express";

import { roleService } from "../service/role.service";
import { Role } from "@/constants/common";
import { logError } from "@/shared/utils/log";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";

export class CreateRole {
  public async create(req: Request, res: Response, next: NextFunction) {
    const { role, description, permission } = req.body;

    if (!role) {
      return next(new BadRequestError("Role is required", "ROLE_REQUIRED"));
    }

    if (!Object.values(Role).includes(role)) {
      return next(
        new BadRequestError(
          "field (role) must be one of the following: " +
            Object.values(Role).join(", "),
          "ROLE_INVALID"
        )
      );
    }

    try {
      const newRole = await roleService.createRole({
        role,
        description: description || "",
        permission: permission || [],
      });
      return res.status(201).json({
        message: "Role created successfully",
        data: newRole,
      });
    } catch (error) {
      logError("create-role", "create role fail", error);
      return next(
        new ServerError("Error creating new role", "CREATE_ROLE_ERROR")
      );
    }
  }
}
