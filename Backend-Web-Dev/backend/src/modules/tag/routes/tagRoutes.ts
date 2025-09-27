import express, { Router } from "express";

import { CreateTag } from "../controller/create-tag";
import { CreateChildTag } from "../controller/create-child-tag";
import { GetAllTag } from "../controller/get-all-tag";
import { GetAllChildTag } from "../controller/get-all-child-tag";
import { UpdateTag } from "../controller/update-tag";
import { UpdateChildTag } from "../controller/update-child-tag";
import { DeleteTag } from "../controller/delete-tag";
import { DeleteChildTag } from "../controller/delete-child-tag";
import { GetTagById } from "../controller/get-tag-by-id";
import { GetChildTag } from "../controller/get-child-tag";

import { GetAllTagHeader } from "../controller/get-tag-header";
import { GetDetailTag } from "../controller/get-detail-tag";

import { CheckExistChildTag } from "../controller/check-exist-child-tag";
import { CheckExistTag } from "../controller/check-exist-tag";

import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { Role } from "@/constants/common";

class TagRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/tag", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    //------------------------- Tag -------------------------
    this.router.post(
      "/",
      authAuthMiddleware([Role.ROOT]),
      CreateTag.prototype.create
    );
    this.router.get("/", GetAllTag.prototype.read);
    this.router.patch(
      "/",
      authAuthMiddleware([Role.ROOT]),
      UpdateTag.prototype.update
    );
    this.router.delete(
      "/",
      authAuthMiddleware([Role.ROOT]),
      DeleteTag.prototype.delete
    );
    this.router.get("/:tag_id", GetTagById.prototype.read);
    //------------------------- Child Tag -------------------------
    this.router.post(
      "/child",
      authAuthMiddleware([Role.ROOT]),
      CreateChildTag.prototype.create
    );
    this.router.get("/child/:tag_id", GetAllChildTag.prototype.readByTagId);
    this.router.patch(
      "/child",
      authAuthMiddleware([Role.ROOT]),
      UpdateChildTag.prototype.update
    );
    this.router.delete(
      "/child",
      authAuthMiddleware([Role.ROOT]),
      DeleteChildTag.prototype.delete
    );
    this.router.post("/child-by-id", GetChildTag.prototype.getById);
    this.router.post("/child-by-slug", GetChildTag.prototype.getAllBySlug);

    this.router.post("/check", CheckExistTag.prototype.check);
    this.router.post("/child/check", CheckExistChildTag.prototype.check);

    this.router.post("/header", GetAllTagHeader.prototype.read);
    this.router.post("/detail", GetDetailTag.prototype.read);

    return this.router;
  }
}

export const tagRoutes: TagRoutes = new TagRoutes();
