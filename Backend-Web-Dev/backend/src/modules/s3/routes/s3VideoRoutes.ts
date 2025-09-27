import express, { Router } from "express";
import uploadVideo from "@/shared/middleware/video.multer";

import { UploadVideoS3 } from "../controller/video/upload";
import { DeleteVideoS3 } from "../controller/video/delete";

import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { masterAuthMiddleware } from "@/shared/middleware/master.middleware";
import { isLimitUploadMiddleware } from "@/modules/s3/middleware/isLimitUpload.middleware";
import { verifySignature } from "@/shared/middleware/verifySignature.middleware";
import { Role } from "@/constants/common";

class UploadVideoRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/s3/video", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.post(
      "/upload",
      verifySignature(),
      authAuthMiddleware([Role.ROOT, Role.ADMIN, Role.USER]),
      isLimitUploadMiddleware(),
      uploadVideo.single("file"),
      UploadVideoS3.prototype.create
    );
    this.router.delete(
      "/delete",
      authAuthMiddleware([Role.ROOT, Role.ADMIN, Role.USER]),
      DeleteVideoS3.prototype.delete
    );
    return this.router;
  }
}

export const uploadVideoRoutes: UploadVideoRoutes = new UploadVideoRoutes();
