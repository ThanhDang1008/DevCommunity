import express, { Router } from "express";
import { ResetPassword } from "../controller/reset-password";
import { VerifyResetPassword } from "../controller/verify-reset-password";
import { Register } from "../controller/register";

import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { verifySignature } from "@/shared/middleware/verifySignature.middleware";
import { Role } from "@/constants/common";

class MailRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/mail", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.post(
      "/reset-password",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      ResetPassword.prototype.send
    );
    this.router.post(
      "/update-password",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      VerifyResetPassword.prototype.execute
    );
    this.router.post(
      "/register",
      verifySignature(),
      Register.prototype.send
    );
    return this.router;
  }
}

export const mailRoutes: MailRoutes = new MailRoutes();
