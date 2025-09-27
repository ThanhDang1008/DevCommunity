import { Request, Response, NextFunction } from "express";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import fs from "fs";

import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
  FileTooLargeError,
} from "@/shared/globals/exceptions/error-handler";
import { config } from "@/config.app";
import { logError } from "@/shared/utils/log";
import { deleteFile } from "@/shared/utils/initFile";

import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";

export class TestS3 {
  public async create(req: Request, res: Response, next: NextFunction) {
    // const message =
    //   req.body.message || "Tải hình thất bại! Vui lòng thử lại sau";
    // if (!req.file) {
    //   return res.status(400).json({
    //     statusCode: 400,
    //     message: message,
    //     status: "UPLOAD_IMAGE_ERROR",
    //   });
    // }

    // console.log(
    //   "✅ " +
    //     formatToLocalDateTime(new Date().toISOString()) +
    //     ` - Upload image: ${req?.file?.filename} | ${req?.file?.size} bytes`
    // );

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
      //   const listParams = {
      //     Bucket: config.CLOUDFLARE_R2_BUCKET_NAME,
      //   };
      //   const listCommand = new ListObjectsV2Command({
      //     Bucket: config.CLOUDFLARE_R2_BUCKET_NAME,
      //     MaxKeys: 3,
      //     //lấy 3 file gần nhất
      //     StartAfter: "2025-03-17",
      //   });
      //   const listResponse = await s3.send(listCommand);

      const listAllFiles = async (bucketName: string) => {
        let continuationToken = undefined;
        const allFiles = [];
        console.log("continuationToken: ", continuationToken);

        do {
          const command: ListObjectsV2Command = new ListObjectsV2Command({
            Bucket: bucketName,
            MaxKeys: 1,
            ContinuationToken: continuationToken,
            Prefix: `image/`,
          });
          console.log("continuationToken: ", continuationToken);
          const response = await s3.send(command);
          console.log("response: ", response);
          if (!response) {
            return [];
          }
          if (response.Contents) {
            allFiles.push(...response.Contents); // Thêm các file vào danh sách
          }
          // Cập nhật token cho lần gọi tiếp theo
          continuationToken = response.NextContinuationToken;
        } while (continuationToken); // Tiếp tục cho đến khi không còn token

        // Sắp xếp theo thời gian từ mới nhất đến cũ nhất
        //   const sortedFiles = allFiles.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));

        //   // Phân trang
        //   const startIndex = (page - 1) * limit;
        //   const paginatedFiles = sortedFiles.slice(startIndex, startIndex + limit);

        //   return paginatedFiles.map(file => file.Key);
        return allFiles;
      };

      const files = await listAllFiles(config.CLOUDFLARE_R2_BUCKET_NAME);
      return res.status(200).json({
        statusCode: 200,
        message: "blablaa",
        data: {
          files: files,
        },
      });
    } catch (error) {
      logError("upload", "Upload imagehhh error", error);
      return next(new ServerError("Tải hình thất bại!", "UPLOAD_IMAGE_ERROR"));
    }
  }
}
