import express, { Router } from "express";
//import { Test } from "../controller/_test";

class SessionRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/session", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    // this.router.post("/test", Test.prototype.create);
    return this.router;
  }
}

export const sessionRoutes: SessionRoutes = new SessionRoutes();