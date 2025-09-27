import express, { Router } from "express";

import { masterAuthMiddleware } from "@/shared/middleware/master.middleware";
import { CreateRole } from "../controller/create-role";
import { GetRole } from "../controller/get-role";

import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { Role } from "@/constants/common";

class RoleRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/role", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.post("/", masterAuthMiddleware, CreateRole.prototype.create);
    this.router.get(
      "/",
      //authAuthMiddleware([Role.ROOT, Role.ADMIN]),
      GetRole.prototype.list
    );
    return this.router;
  }
}

export const roleRoutes: RoleRoutes = new RoleRoutes();
