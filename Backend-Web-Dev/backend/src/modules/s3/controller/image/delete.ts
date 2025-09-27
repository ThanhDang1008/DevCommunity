import { Request, Response, NextFunction } from "express";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { config } from "@/config.app";
import { logError } from "@/shared/utils/log";

import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";
import { s3Service } from "@/modules/s3/service/s3.service";

export class DeleteImageS3 {
  public async delete(req: Request, res: Response, next: NextFunction) {
    const key = req.body.key;

    if (!key) {
      return next(new BadRequestError("Xoá hình ảnh thất bại!", "MISSING_KEY"));
    }

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

    try {
      const params = {
        Bucket: config.CLOUDFLARE_R2_BUCKET_NAME,
        Key: `image/${key}`,
        Delete: {},
      };

      const command = new DeleteObjectCommand(params);
      const response = await s3.send(command);
      //console.log("Xóa thành công: ", response);

      console.log(
        "✅ " +
          formatToLocalDateTime(new Date().toISOString()) +
          ` - ☁️ Delete image s3: image/${key}`
      );

      //------------ delete in db ------------------
      s3Service.deleteByKey(`image/${key}`);

      return res.status(200).json({
        statusCode: 200,
        message: "Xoá hình thành công",
      });
    } catch (error) {
      logError("delete", "Delete image error", error);
      return next(
        new ServerError("Xoá hình ảnh thất bại!", "DELETE_IMAGE_ERROR")
      );
    }
  }
}
