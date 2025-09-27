import { Request, Response, NextFunction } from "express";

import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { logError } from "@/shared/utils/log";
import { s3Service } from "../service/s3.service";
import { Readable } from "stream";
import { Role } from "@/constants/common";

import type { ReqBodySession } from "@/shared/middleware/auth.middleware";
import { convertByte } from "../utils/convertByte";

export class GetS3 {
  public async getListFile(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqBodySession;

    const { page, limit } = req.query;
    const { filters } = req.body;
    //console.log("filters", filters);
    const missingFields = [];
    if (!page) missingFields.push("page");
    if (!limit) missingFields.push("limit");
    if (!filters) missingFields.push("filters");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Get list file fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 50 ? parseInt(limit as string) : 10;
    try {
      const listFile = await s3Service.getByfilters(
        session.id_role.role === Role.ROOT ? "" : session.id_user,
        _page,
        _limit,
        filters
      );
      const totalFiles = await s3Service.getTotalFile(
        session.id_role.role === Role.ROOT ? "" : session.id_user,
        filters
      );
      const totalPages = Math.ceil(totalFiles / _limit);

      return res.status(200).json({
        message: "Lấy danh sách file thành công",
        data: listFile,
        currentPage: _page,
        totalPages,
        totalFiles,
      });
    } catch (error) {
      logError("get-s3", "Get list file error", error);
      return next(
        new ServerError("Lấy danh sách file thất bại!", "GET_LIST_FILE_ERROR")
      );
    }
  }

  public async getSizeAuthor(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqBodySession;

    try {
      const listTotalSize = await s3Service.getListSizeByAuthor(
        session.id_role.role === Role.ROOT ? "" : session.id_user
      );
      if (!listTotalSize) {
        return next(
          new BadRequestError(
            "Lấy dung lượng đã sử dụng thất bại",
            "GET_SIZE_ERROR"
          )
        );
      }
      if (listTotalSize.length === 0) {
        return res.status(200).json({
          message: "Chưa có file nào được tải lên",
          data: {
            totalSize: 0,
            totalSizeDescription: convertByte(0),
            count: 0,
            detail: [],
          },
        });
      }

      //  {
      //   _id: {
      //     author: string;
      //     mimetype: string;
      //   };
      //   totalSize: number;
      //   count: number;
      // }[]
      const { totalSize, totalCount } = listTotalSize.reduce(
        (
          acc: { totalSize: number; totalCount: number },
          item: {
            _id: { author: string; mimetype: string };
            totalSize: number;
            count: number;
          }
        ) => ({
          totalSize: acc.totalSize + item.totalSize,
          totalCount: acc.totalCount + item.count,
        }),
        { totalSize: 0, totalCount: 0 } // giá trị khởi tạo
      );
      return res.status(200).json({
        message: "Lấy dung lượng đã sử dụng thành công",
        data: {
          totalSize: totalSize,
          totalSizeDescription: convertByte(totalSize),
          count: totalCount,
          detail: listTotalSize.map((item: any) => ({
            mimetype: item._id.mimetype,
            totalSize: item.totalSize,
            totalSizeDescription: convertByte(item.totalSize),
            count: item.count,
          })),
        },
      });
    } catch (error) {
      logError("get-s3", "Get size author error", error);
      return next(
        new ServerError(
          "Lấy dung lượng đã sử dụng của tác giả thất bại",
          "GET_SIZE_AUTHOR_ERROR"
        )
      );
    }
  }

  public async downloadFile(req: Request, res: Response, next: NextFunction) {
    const { url } = req.body;
    const missingFields = [];
    if (!url) missingFields.push("url");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Download file fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const upstream = await fetch(url);
      if (!upstream.ok)
        return next(
          new ServerError("Tải file thất bại", "DOWNLOAD_FILE_ERROR")
        );

      // Lấy headers gốc hoặc đặt mặc định
      const contentType =
        upstream.headers.get("content-type") || "application/octet-stream";
      const filename = url.split("/").pop() || "file";
      // console.log("filename", filename);
      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      // Convert WHATWG stream → Node Readable và pipe về client
      // @ts-ignore
      Readable.fromWeb(upstream.body).pipe(res);
    } catch (error) {
      logError("get-s3", "Download file error", error);
      return next(new ServerError("Tải file thất bại", "DOWNLOAD_FILE_ERROR"));
    }
  }

  public async getVideoStreamMaster(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const filename = req.params.filename;
      const remoteUrl = `https://s3.cloudfly.vn/file/video/${filename}`;
      const response = await fetch(remoteUrl).catch((error) => {
        logError("get-s3", "getVideoStreamMaster error", error);
        return next(
          new ServerError("Lấy video thất bại", "GET_VIDEO_STREAM_ERROR")
        );
      });
      // @ts-ignore
      Readable.fromWeb(response.body).pipe(res);
    } catch (error) {
      logError("get-s3", "getVideoStreamMaster error", error);
      return next(new ServerError("Đã xảy ra lỗi"));
    }
  }

  public async getVideoStreamP(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const foldername = req.params.foldername;
      const filename = req.params.filename;
      //console.log("params", req.params);
      const remoteUrl = `https://s3.cloudfly.vn/file/video/${foldername}/${filename}`;
      const response = await fetch(remoteUrl).catch((error) => {
        logError("get-s3", "getVideoStreamP error", error);
        return next(
          new ServerError("Lấy video thất bại", "GET_VIDEO_STREAM_ERROR")
        );
      });

      // @ts-ignore
      Readable.fromWeb(response.body).pipe(res);
    } catch (error) {
      logError("get-s3", "getVideoStreamP error", error);
      return next(new ServerError("Đã có lỗi xảy ra"));
    }
  }
}
