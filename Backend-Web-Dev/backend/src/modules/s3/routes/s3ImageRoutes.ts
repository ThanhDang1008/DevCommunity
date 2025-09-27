import express, { Router } from "express";
import uploadImage from "@/shared/middleware/image.multer";

import { UploadImageS3 } from "../controller/image/upload";
import { DeleteImageS3 } from "../controller/image/delete";
import { TestS3 } from "../controller/image/_test";

import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { masterAuthMiddleware } from "@/shared/middleware/master.middleware";
import { isLimitUploadMiddleware } from "@/modules/s3/middleware/isLimitUpload.middleware";
import { verifySignature } from "@/shared/middleware/verifySignature.middleware";
import { Role } from "@/constants/common";

class UploadImageRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/s3/image", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.post(
      "/upload",
      verifySignature(),
      authAuthMiddleware([Role.ROOT, Role.ADMIN, Role.USER]),
      isLimitUploadMiddleware(),
      uploadImage.single("file"),
      UploadImageS3.prototype.create
    );
    this.router.delete(
      "/delete",
      authAuthMiddleware([Role.ROOT, Role.ADMIN, Role.USER]),
      DeleteImageS3.prototype.delete
    );
    //-----------------------------test-----------------------------
    // this.router.post(
    //   "/test",
    //   authAuthMiddleware([Role.ROOT, Role.ADMIN]),
    //   TestS3.prototype.create
    // );
    return this.router;
  }
}

export const uploadImageRoutes: UploadImageRoutes = new UploadImageRoutes();
