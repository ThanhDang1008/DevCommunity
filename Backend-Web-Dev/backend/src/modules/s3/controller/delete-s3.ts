import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { logError } from "@/shared/utils/log";
import { s3Service } from "../service/s3.service";
import { deleteMultipleFile } from "@/modules/s3/utils/deleteMultipleFile";

export class DeleteS3 {
  public async deleteOneFile(req: Request, res: Response, next: NextFunction) {
    const { key } = req.body;
    const missingFields = [];
    if (!key) missingFields.push("key");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Delete file fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }
    try {
      // delete file in db
      const file = await s3Service.deleteByKey(key)
      if (!file) {
        return next(
          new BadRequestError("Xóa file thất bại!", "DELETE_FILE_FAIL")
        );
      }

      // delete file in s3
      await deleteMultipleFile([key]);

      return res.status(200).json({
        message: "Xóa file thành công",
      });
    } catch (error) {
      logError("delete-s3", "Delete file error", error);
      return next(
        new ServerError("Xoá hình ảnh thất bại", "DELETE_FILE_ERROR")
      );
    }
  }
}
