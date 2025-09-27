import express, { Router } from "express";

import { Version } from "../controller/version";
import { Data } from "../controller/web-data";
import { Logger } from "../controller/logger";
import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { Role } from "@/constants/common";

class WebRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/web", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.get("/", Version.prototype.info);
    this.router.get("/logger", Logger.prototype.info);
    this.router.patch(
      "/write-data",
      authAuthMiddleware([Role.ROOT]),
      Data.prototype.write
    );
    this.router.get("/read-data", Data.prototype.read);
    return this.router;
  }
}

export const webRoutes: WebRoutes = new WebRoutes();
