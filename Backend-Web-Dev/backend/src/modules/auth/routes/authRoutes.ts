// import { Register } from "../controller/register";
import express, { Router } from "express";

import { masterAuthMiddleware } from "@/shared/middleware/master.middleware";
import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { Role } from "@/constants/common";
import { verifySignature } from "@/shared/middleware/verifySignature.middleware";

import { GenerateAccount } from "../controller/generate-account";
import { SignIn } from "../controller/signin";
import { SignInWithMedia } from "../controller/signin-with-media";
import { GetDataUser } from "../controller/get-data-user";
import { SignOut } from "../controller/signout";
import { Register } from "../controller/register";

class AuthRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/auth", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.post("/signin", SignIn.prototype.read);
    this.router.post("/signin-with-media", SignInWithMedia.prototype.exec);
    this.router.get("/account", GetDataUser.prototype.read);
    this.router.delete(
      "/signout",
      authAuthMiddleware(Object.values(Role)),
      SignOut.prototype.update
    );
    //this.router.post("/register", Register.prototype.create);
    this.router.post(
      "/generate-account",
      masterAuthMiddleware,
      GenerateAccount.prototype.create
    );
    this.router.post(
      "/register",
      verifySignature(),
      Register.prototype.create
    );
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
