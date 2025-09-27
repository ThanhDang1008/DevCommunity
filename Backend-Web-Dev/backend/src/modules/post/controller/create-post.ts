import { Request, Response, NextFunction } from "express";

import { postService } from "../service/post.service";
import { logError } from "@/shared/utils/log";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { statusPost } from "@modules/post/constants/common";
import { ReqBodySession } from "@/shared/middleware/auth.middleware";

export class CreatePost {
  public async create(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqBodySession;

    const {
      slug,
      title,
      description,
      content,
      toc,
      link,
      thumbnail,
      category,
      tags,
      keywords,
      status,
      createdAt,
    } = req.body;
    const missingFields = [];
    if (!slug) missingFields.push("slug");
    if (!title) missingFields.push("title");
    if (!content) missingFields.push("content");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Create post fail, missing fields`,
          "MISSING_FIELDS"
        )
      );
    }

    if (!Object.values(statusPost).includes(status)) {
      return next(
        new BadRequestError(
          "field (status) must be one of the following: " +
            Object.values(statusPost).join(", "),
          "STATUS_INVALID"
        )
      );
    }

    try {
      const post = await postService.createPost({
        slug: slug,
        title: title,
        description: description ? description : "",
        content: content,
        toc: toc,
        link: link,
        thumbnail: thumbnail ? thumbnail : "",
        category: category.filter((item: string) => item !== ""),
        status: status,
        author: session.id_user,
        tags: tags,
        keywords: keywords,
        createdAt: createdAt ? createdAt : new Date().toISOString(),
      });
      if (!post) {
        return next(
          new BadRequestError("Tạo bài viết thất bại!", "CREATE_POST_FAIL")
        );
      }
      return res.status(201).json({
        message: "Tạo bài viết thành công",
        data: post,
      });
    } catch (error) {
      logError("create-post", "Create post fail", error);
      return next(
        new ServerError("Tạo bài viết thất bại!", "INTERNAL_SERVER_ERROR")
      );
    }
  }
}
