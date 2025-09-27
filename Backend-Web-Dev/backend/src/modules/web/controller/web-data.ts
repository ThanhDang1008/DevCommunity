import { Request, Response, NextFunction } from "express";
import path from "path";

import { logError } from "@/shared/utils/log";
import {
  ServerError,
  BadRequestError,
} from "@/shared/globals/exceptions/error-handler";
import { writeData, readData } from "../utils/web.utils";

export class Data {
  public async read(req: Request, res: Response, next: NextFunction) {
    try {
      const filePath = path.join("./data", "data.json");
      const data = readData(filePath);
      if (!data) {
        return next(
          new BadRequestError("Lấy dữ liệu thất bại", "READ_DATA_FAIL")
        );
      }
      return res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: {
          ...data,
        },
      });
    } catch (error) {
      logError("read-data", "read data fail", error);
      return next(
        new ServerError("Cập nhật thất bại", "INTERNAL_SERVER_ERROR")
      );
    }
  }

  public async write(req: Request, res: Response, next: NextFunction) {
    try {
      const filePath = path.join("./data", "data.json");
      const data_old = readData(filePath);
      if (!data_old) {
        return next(
          new BadRequestError("Cập nhật thất bại", "READ_DATA_OLD_FAIL")
        );
      }
      const data_new = { ...data_old, ...req.body };
      const writeResult = writeData(filePath, data_new);
      if (!writeResult) {
        return next(
          new BadRequestError("Cập nhật thất bại", "WRITE_DATA_FAIL")
        );
      }
      return res.status(200).json({
        message: "Cập nhật thành công",
        data: {
          ...data_new,
        },
      });
    } catch (error) {
      logError("read-data", "read data fail", error);
      return next(
        new ServerError("Cập nhật thất bại", "INTERNAL_SERVER_ERROR")
      );
    }
  }
}
