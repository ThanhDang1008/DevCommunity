import { Request, Response, NextFunction } from "express";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import fs from "fs";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { config } from "@/config.app";
import { logError } from "@/shared/utils/log";
import { deleteFile } from "@/shared/utils/initFile";

import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";
import { s3Service } from "@/modules/s3/service/s3.service";
import type { ReqBodySession } from "@/shared/middleware/auth.middleware";

export class UploadImageS3 {
  public async create(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqBodySession;

    const message =
      req.body.message || "Tải hình thất bại! Vui lòng thử lại sau";
    if (!req.file) {
      return res.status(400).json({
        statusCode: 400,
        message: message,
        status: "UPLOAD_IMAGE_ERROR",
      });
    }

    console.log(
      "✅ " +
        formatToLocalDateTime(new Date().toISOString()) +
        ` - Upload image: ${req?.file?.filename} | ${req?.file?.size} bytes`
    );

    const s3 = new S3Client({
      endpoint: config.CLOUDFLARE_R2_ENDPOINT,
      region: "apac", //wnam, enam, weur, eeur, apac, oc, auto
      credentials: {
        accessKeyId: config.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: config.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true, // Cần thiết cho các dịch vụ S3-compatible
      //signatureVersion: "v4", // Một số dịch vụ cần chữ ký v4
    });

    // Example of req.file object {
    //   fieldname: 'file',
    //   originalname: 'Screenshot (96).png',
    //   encoding: '7bit',
    //   mimetype: 'image/png',
    //   destination: './upload/image/',
    //   filename: 'Screenshot (96) 1740931592570.png',
    //   path: 'upload\\image\\Screenshot (96) 1740931592570.png',
    //   size: 2066643
    // }

    try {
      const pathFile = req?.file?.destination + req?.file?.filename;
      const fileBuffer = fs.readFileSync(pathFile);
      //console.log("fileBuffer", fileBuffer);
      const params: PutObjectCommandInput = {
        Bucket: config.CLOUDFLARE_R2_BUCKET_NAME,
        Key: `image/${req?.file?.filename}`,
        Body: fileBuffer,
        ContentType: req?.file?.mimetype,
        ACL: ObjectCannedACL.public_read, // Cho phép file có thể được truy cập công khai
      };

      const fileUrl = `${config.CLOUDFLARE_R2_DOMAIN}/${config.CLOUDFLARE_R2_BUCKET_NAME}/image/${req?.file?.filename}`;
      const command = new PutObjectCommand(params);
      const response = await s3.send(command);
      // response {
      //   '$metadata': {
      //     httpStatusCode: 200,
      //     requestId: undefined,
      //     extendedRequestId: undefined,
      //     cfId: undefined,
      //     attempts: 1,
      //     totalRetryDelay: 0
      //   },
      //   ETag: '"5f77250b0a33a87de2bf9621b225b912"',
      //   ChecksumCRC32: 'E9HFgw==',
      //   VersionId: '7e6a6a36f5a0bb1f3b4b3c83747e9a02'
      // }
      //console.log("response", response);
      await deleteFile(pathFile);
      //------------ upload to db --------------
      s3Service.create({
        key: `image/${req?.file?.filename}`,
        url: fileUrl,
        mimetype: req?.file?.mimetype,
        originalname: req?.file?.originalname,
        size: req?.file?.size,
        bucket: config.CLOUDFLARE_R2_BUCKET_NAME,
        author: session.id_user,
      });
      //-----------------------------------------
      return res.status(200).json({
        statusCode: 200,
        message: "Tải hình thành công",
        data: {
          url: fileUrl,
        },
      });
    } catch (error) {
      logError("upload", "Upload image error", error);
      return next(new ServerError("Tải hình thất bại!", "UPLOAD_IMAGE_ERROR"));
    }
  }
}
