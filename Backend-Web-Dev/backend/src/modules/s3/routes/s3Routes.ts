import express, { Router } from "express";

import uploadFile from "@/shared/middleware/file.multer";

import { GetS3 } from "../controller/get-s3";
import { DeleteS3 } from "../controller/delete-s3";
import { UploadFileS3 } from "../controller/upload-s3";

import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { isLimitUploadMiddleware } from "@/modules/s3/middleware/isLimitUpload.middleware";
import { verifySignature } from "@/shared/middleware/verifySignature.middleware";
import { Role } from "@/constants/common";

class S3Routes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/s3", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.post(
      "/file",
      authAuthMiddleware(Object.values(Role)),
      GetS3.prototype.getListFile
    );
    this.router.get(
      "/file/total-size-upload",
      authAuthMiddleware(Object.values(Role)),
      GetS3.prototype.getSizeAuthor
    );
    this.router.delete(
      "/file",
      authAuthMiddleware(Object.values(Role)),
      DeleteS3.prototype.deleteOneFile
    );
    this.router.post(
      "/file/download",
      verifySignature(),
      // authAuthMiddleware([Role.ROOT]),
      GetS3.prototype.downloadFile
    );
    this.router.post(
      "/file/upload",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      isLimitUploadMiddleware(),
      uploadFile.single("file"),
      UploadFileS3.prototype.uploadFile
    );
    this.router.post(
      "/file/upload-stream",
      verifySignature(),
      authAuthMiddleware([Role.ROOT, Role.ADMIN, Role.USER]),
      isLimitUploadMiddleware("stream-file-size"),
      UploadFileS3.prototype.uploadFileStream
    );
    this.router.get(
      "/file/video/stream/:filename",
      GetS3.prototype.getVideoStreamMaster
    )
      this.router.get(
      "/file/video/stream/:foldername/:filename",
      GetS3.prototype.getVideoStreamP
    );
    return this.router;
  }
}

export const s3Routes: S3Routes = new S3Routes();
