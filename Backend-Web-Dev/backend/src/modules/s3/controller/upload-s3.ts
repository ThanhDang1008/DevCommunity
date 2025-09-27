import { Request, Response, NextFunction } from "express";
import { ObjectCannedACL } from "@aws-sdk/client-s3";
import fs from "fs";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { config } from "@/config.app";
import { logError, logSuccess } from "@/shared/utils/log";
import { deleteFile } from "@/shared/utils/initFile";

import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";
import { s3Service } from "@/modules/s3/service/s3.service";
import type { ReqBodySession } from "@/shared/middleware/auth.middleware";

import { initFolder, deleteFolder } from "@/shared/utils/initFolder";
import path from "path";
import { promisify } from "util";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import busboy from "busboy";
import { uploadFileStream } from "@/modules/s3/utils/uploadFileStream";
import { uploadFile } from "@/modules/s3/utils/uploadFile";
import { convertVideoStream } from "@/modules/s3/utils/covertVideoStream";
import {
  createOrUpdateSession,
  clearSessionOnly,
  isUploadComplete,
  markChunkReceived,
  startCleanupTimer,
  stopCleanupTimer,
} from "@/modules/s3/utils/uploadSessions";

export class UploadFileS3 {
  public async uploadFileStream(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const session = JSON.parse(
        req.headers["session"] as string
      ) as ReqBodySession;

      const busboyInstance = busboy({
        headers: req.headers, // Thêm headers vào busboy
        limits: { fileSize: 51 * 1024 * 1024 }, // tối đa mỗi chunk 51MB
      });

      const uploadId = req.headers["stream-upload-id"]?.toString() as string; //string | undefined
      const fileName = req.headers["stream-file-name"]?.toString() as string; //string | undefined
      const chunkIndex = parseInt(req.headers["stream-chunk-index"] as string); //number | NaN
      const totalChunks = parseInt(
        req.headers["stream-total-chunks"] as string
      ); //number | NaN

      const mimeType = req.headers["stream-file-type"]?.toString() as string; //string | undefined

      // console.log(
      //   "uploadId",
      //   uploadId,
      //   "fileName",
      //   fileName,
      //   "chunkIndex",
      //   chunkIndex,
      //   "totalChunks",
      //   totalChunks
      // );

      if (!uploadId || !fileName || isNaN(chunkIndex) || isNaN(totalChunks)) {
        return next(
          new BadRequestError("Tải tệp tin thất bại", "MISSING_FIELDS")
        );
      }
      const uploadSessionDir = path.join(
        `${config.PATH_STORAGE_FILE}`,
        uploadId
      );

      busboyInstance.on("field", (fieldname: string, val: string) => {});

      // Kiểm tra xem session đã tồn tại chưa
      startCleanupTimer();
      // Tạo hoặc cập nhật session
      createOrUpdateSession(
        uploadId,
        fileName,
        totalChunks,
        session.id_user,
        mimeType
      );

      busboyInstance.on(
        "file",
        async (
          fieldname: string,
          fileStream: Readable,
          fileInfo: busboy.FileInfo
        ) => {
          if (fieldname === "chunk") {
            if (!fs.existsSync(uploadSessionDir)) {
              await fs.promises
                .mkdir(uploadSessionDir, { recursive: true })
                .catch((err) => {
                  return next(
                    new ServerError("Tải tệp tin thất bại", "CREATE_DIR_ERROR")
                  );
                });
            }
            const chunkFile = path.join(
              `${config.PATH_STORAGE_FILE}${uploadId}`,
              `chunk-${chunkIndex}`
            );
            const writeStream = fs.createWriteStream(chunkFile);

            fileStream.pipe(writeStream);

            // Đánh dấu chunk đã nhận thành công
            markChunkReceived(uploadId, chunkIndex);

            writeStream.on("finish", () => {
              // console.log(
              //   `Chunk ${chunkIndex} đã được lưu vào ${chunkPath} thành công`
              // );
            });
            writeStream.on("error", async (err) => {
              logError("upload-s3", "Write chunk error", err);
              return next(
                new ServerError("Tải tệp tin thất bại", "WRITE_STREAM_ERROR")
              );
            });

            fileStream.resume(); // Consume stream để tránh memory leak
            return;
          }
        }
      );

      busboyInstance.on("finish", async () => {
        const isLastChunk = chunkIndex === totalChunks - 1;
        if (isLastChunk && isUploadComplete(uploadId)) {
          //ghép tất cả các chunk lại thành file hoàn chỉnh
          const fileExtension = fileName.split(".").pop();
          const originalname = fileName.split(".").shift();
          const finalFileName = `${originalname}-${Date.now()}.${fileExtension}`;
          const finalFilePath = path.join(
            `${config.PATH_STORAGE_FILE}${finalFileName}`
          );

          for (let i = 0; i < Number(totalChunks); i++) {
            const chunkPath = path.join(uploadSessionDir, `chunk-${i}`);
            //console.log("chunkPath", chunkPath);

            if (!fs.existsSync(chunkPath)) {
              deleteFile(finalFilePath);
              deleteFolder(uploadSessionDir);
              clearSessionOnly(uploadId);
              return next(
                new ServerError("Tải tệp tin thất bại", "CHUNK_PATH_NOT_FOUND")
              );
            }
            const readStream = fs.createReadStream(chunkPath);
            const writeStream = fs.createWriteStream(finalFilePath, {
              flags: "a",
            });

            await pipeline(readStream, writeStream);
          }

          try {
            //------------ Kiểm tra dung lượng file sau khi ghép xong --------------
            const stats = fs.statSync(finalFilePath);
            if (stats.size === 0) {
              deleteFile(finalFilePath);
              deleteFolder(uploadSessionDir);
              clearSessionOnly(uploadId);
              return next(
                new ServerError("Tải tệp tin thất bại", "MERGED_FILE_EMPTY")
              );
            }
            //--------------------------------
            const data = await uploadFileStream({
              key: finalFileName,
              filePath: finalFilePath,
              mimeType: mimeType || undefined,
              acl: "public-read",
            }).catch((error) => {
              logError("upload-s3", "Upload file stream error", error);
              deleteFile(finalFilePath);
              deleteFolder(uploadSessionDir);
              clearSessionOnly(uploadId);
              return next(
                new ServerError(
                  "Tải tệp tin thất bại",
                  "UPLOAD_STREAM_S3_ERROR"
                )
              );
            });

            if (!data) {
              deleteFile(finalFilePath);
              deleteFolder(uploadSessionDir);
              clearSessionOnly(uploadId);
              return next(
                new ServerError(
                  "Tải tệp tin thất bại",
                  "UPLOAD_STREAM_S3_ERROR"
                )
              );
            }

            //------------ upload to db --------------
            s3Service
              .create({
                key: `${finalFileName}`,
                url: data?.url,
                mimetype: mimeType || "application/octet-stream",
                originalname: fileName,
                size: data?.size,
                bucket: config.CLOUDFLARE_R2_BUCKET_NAME,
                author: session.id_user,
              })
              .catch((error) => {
                logError("upload-s3", "Upload file to DB error", error);
                deleteFile(finalFilePath);
                deleteFolder(uploadSessionDir);
                clearSessionOnly(uploadId);
                return next(
                  new ServerError("Tải tệp tin thất bại", "UPLOAD_DB_ERROR")
                );
              });
            //-----------------------------------------

            // Cleanup sau khi upload thành công

            deleteFile(finalFilePath);
            deleteFolder(uploadSessionDir);
            clearSessionOnly(uploadId);
            stopCleanupTimer();

            return res.status(200).json({
              message: "Tất cả chunk đã được tải lên thành công",
              chunkIndex: chunkIndex,
              totalChunks: totalChunks,
              fileName: fileName,
              mimeType: mimeType,
              url: data?.url || "",
              key: finalFileName,
            });
          } catch (error) {
            logError(
              "upload-s3",
              "Upload file stream chunk merge error",
              error
            );
            deleteFile(finalFilePath);
            deleteFolder(uploadSessionDir);
            clearSessionOnly(uploadId);
            return next(
              new ServerError("Tải tệp tin thất bại", "CHUNK_FINISH_ERROR")
            );
          }
        }
        if (!isLastChunk) {
          return res.status(200).json({
            message: `Chunk ${chunkIndex + 1}/${totalChunks} đã được nhận`,
            chunkIndex: chunkIndex,
            totalChunks: totalChunks,
            fileName: fileName,
            mimeType: mimeType,
          });
        }
      });

      busboyInstance.on("error", async (error: Error) => {
        logError("upload-s3", "Busboy error", error);
        return next(new ServerError("Tải tệp tin thất bại", "BUSBOY_ERROR"));
      });

      //  req.on("error", async (error) => {
      //   logError("upload-s3", "Request error", error);
      // });

      req.pipe(busboyInstance);
    } catch (error) {
      logError("upload-s3", "Upload file stream error", error);
      return next(new ServerError("Tải tệp tin thất bại"));
    }
  }

  public async uploadFile(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqBodySession;

    const message =
      req.body.message || "Tải file thất bại! Vui lòng thử lại sau";
    if (!req.file) {
      return res.status(400).json({
        statusCode: 400,
        message: message,
        status: "UPLOAD_FILE_ERROR",
      });
    }

    logSuccess(
      `Upload file: ${req?.file?.filename} | ${req?.file?.size} bytes`
    );

    try {
      const pathFile = req?.file?.destination + req?.file?.filename;

      await uploadFile({
        key: `${req?.file?.filename}`,
        filePath: pathFile,
        bucket: config.CLOUDFLARE_R2_BUCKET_NAME,
        acl: ObjectCannedACL.public_read,
      });

      const fileUrl = `${config.CLOUDFLARE_R2_DOMAIN}/${config.CLOUDFLARE_R2_BUCKET_NAME}/${req?.file?.filename}`;

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

      deleteFile(pathFile);
      //------------ upload to db --------------
      s3Service.create({
        key: `${req?.file?.filename}`,
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
        message: "Tải file thành công",
        data: {
          url: fileUrl,
        },
      });
    } catch (error) {
      logError("upload-s3", "Upload file error", error);
      return next(new ServerError("Tải file thất bại"));
    }
  }
}
