import { Request, Response, NextFunction } from "express";

import { postService } from "../service/post.service";
import { logError } from "@/shared/utils/log";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { deleteMultipleImages } from "@/modules/s3/utils/deleteMultipleImages";
import { deleteMultipleVideos } from "@/modules/s3/utils/deleteMultipleVideos";
import { s3Service } from "@/modules/s3/service/s3.service";

export class DeletePost {
  public async deleteById(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.params;
    const { link, thumbnail } = req.body;
    const missingFields = [];
    if (!_id) missingFields.push("_id");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Delete post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }
    try {
      // delete post
      const post = await postService.deletePost(_id.toString());
      if (!post) {
        return next(
          new BadRequestError("Xóa bài viết thất bại!", "DELETE_POST_FAIL")
        );
      }

      // delete db
      await s3Service.deleteMultipleByUrl([thumbnail]);

      if (link?.image.length > 0) {
        await s3Service.deleteMultipleByUrl(link?.image || []);
      }
      if (link?.video.length > 0) {
        await s3Service.deleteMultipleByUrl(link?.video || []);
      }
      
      //delete s3
      await deleteMultipleImages([thumbnail]);

      if (link?.image.length > 0) {
        await deleteMultipleImages(link?.image || []);
      }

      if (link?.video.length > 0) {
        await deleteMultipleVideos(link?.video || []);
      }

      return res.status(200).json({
        message: "Xóa bài viết thành công",
        //data: post,
      });
    } catch (error) {
      logError("delete-post", "Delete post fail", error);
      return next(
        new ServerError("Xóa bài viết thất bại!", "INTERNAL_SERVER_ERROR")
      );
    }
  }
}
