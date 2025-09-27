import { Request, Response, NextFunction } from "express";

import { postService } from "../service/post.service";
import { logError } from "@/shared/utils/log";
import {
  BadRequestError,
  ServerError,
  JoiRequestValidationError,
} from "@/shared/globals/exceptions/error-handler";
import type { ReqBodySession } from "@/shared/middleware/auth.middleware";
import { Role } from "@/constants/common";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";

export class GetPost {
  public async getAllRecent(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqBodySession;
    const { filters } = req.body;
    //console.log("session", session);

    const { page, limit } = req.query;
    const missingFields = [];
    if (!page) missingFields.push("page");
    if (!limit) missingFields.push("limit");
    if (!filters) missingFields.push("filters");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Get post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 80 ? parseInt(limit as string) : 10;
    try {
      const posts = await postService.getAllRecent(
        _page,
        _limit,
        session?.id_role?.role === Role.ROOT ? "" : session?.id_user,
        filters
      );
      //console.log("posts", posts);
      if (!posts) {
        return next(
          new BadRequestError("Không có bài viết nào!", "POST_NOT_FOUND")
        );
      }

      const totalPosts = await postService.getCountAll(
        session?.id_role?.role === Role.ROOT ? "" : session?.id_user,
        filters
      );
      const totalPages = Math.ceil(totalPosts / _limit);

      return res.status(200).json({
        message: "Lấy bài viết gần nhất thành công!",
        data: posts,
        currentPage: _page,
        totalPages,
        totalPosts,
      });
    } catch (error) {
      logError("get-post", "getAllRecent fail", error);
      return next(
        new ServerError(
          "Lấy bài viết gần nhất thất bại",
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }

  public async getPostBySlug(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;
    const missingFields = [];
    if (!slug) missingFields.push("slug");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Get post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const post = await postService.getPostBySlug(slug);
      if (!post) {
        return next(
          new BadRequestError("Bài viết không tồn tại!", "POST_NOT_FOUND")
        );
      }
      return res.status(200).json({
        message: "Lấy bài viết thành công!",
        data: post,
      });
    } catch (error) {
      logError("get-post", "getPostBySlug fail", error);
      return next(
        new ServerError("Lấy bài viết thất bại!", "INTERNAL_SERVER_ERROR")
      );
    }
  }

  public async getPostById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const missingFields = [];
    if (!id) missingFields.push("id");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Get post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    try {
      const post = await postService.getPostById(id);
      if (!post) {
        return next(
          new BadRequestError("Bài viết không tồn tại!", "POST_NOT_FOUND")
        );
      }
      return res.status(200).json({
        message: "Lấy bài viết thành công!",
        data: post,
      });
    } catch (error) {
      logError("get-post", "getPostById fail", error);
      return next(
        new ServerError("Lấy bài viết thất bại!", "INTERNAL_SERVER_ERROR")
      );
    }
  }

  public async getAllRecentPublished(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { page, limit } = req.query;
    const { listFriendId } = req.body;
    //console.log("getAllRecentPublished", req.body);
    const missingFields = [];
    if (!page) missingFields.push("page");
    if (!limit) missingFields.push("limit");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Get post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 80 ? parseInt(limit as string) : 10;
    try {
      const posts = await postService.getAllRecentPublished({
        page: _page,
        limit: _limit,
        listFriendId: listFriendId?.length > 0 ? listFriendId : [],
      });
      if (!posts) {
        return next(
          new BadRequestError("Không có bài viết nào!", "POST_NOT_FOUND")
        );
      }

      const totalPosts = await postService.getCountAllRecentPublished();
      const totalPages = Math.ceil(totalPosts / _limit);

      return res.status(200).json({
        message: "Lấy bài viết đã xuất bản thành công",
        data: posts,
        currentPage: _page,
        totalPages,
        totalPosts,
      });
    } catch (error) {
      logError("get-post", "getAllRecentPublished fail", error);
      return next(
        new ServerError(
          "Lấy bài viết đã xuất bản thất bại",
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }

  public async getAllPostByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqBodySession;

    const { page, limit } = req.query;
    const { category } = req.body;
    const missingFields = [];

    if (!category) missingFields.push("category");
    if (!page) missingFields.push("page");
    if (!limit) missingFields.push("limit");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Get post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 80 ? parseInt(limit as string) : 10;
    try {
      const posts = await postService.getAllByCategory(
        _page,
        _limit,
        category,
        session?.id_role?.role === Role.ROOT ? "" : session?.id_user
      );
      if (!posts) {
        return next(
          new BadRequestError("Không có bài viết nào!", "POST_NOT_FOUND")
        );
      }

      const totalPosts = await postService.getCountAllByCategory(
        category,
        session?.id_role?.role === Role.ROOT ? "" : session?.id_user
      );
      const totalPages = Math.ceil(totalPosts / _limit);

      return res.status(200).json({
        message: "Lấy bài viết theo danh mục thành công!",
        data: posts,
        currentPage: _page,
        totalPages,
        totalPosts,
      });
    } catch (error) {
      logError("get-post", "getAllPostByCategory fail", error);
      return next(
        new ServerError(
          "Lấy bài viết theo danh mục thất bại!",
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }

  public async getAllPostByCategoryPublished(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { page, limit } = req.query;
    const { category } = req.body;
    const missingFields = [];

    if (!category) missingFields.push("category");
    if (!page) missingFields.push("page");
    if (!limit) missingFields.push("limit");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Get post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 80 ? parseInt(limit as string) : 10;
    try {
      const posts = await postService.getAllByCategoryPublished(
        _page,
        _limit,
        category
      );
      if (!posts) {
        return next(
          new BadRequestError("Không có bài viết nào!", "POST_NOT_FOUND")
        );
      }

      const totalPosts = await postService.getCountAllByCategoryPublished(
        category
      );
      const totalPages = Math.ceil(totalPosts / _limit);

      return res.status(200).json({
        message: "Lấy bài viết theo danh mục thành công",
        data: posts,
        currentPage: _page,
        totalPages,
        totalPosts,
      });
    } catch (error) {
      logError("get-post", "getAllPostByCategoryPublished fail", error);
      return next(
        new ServerError(
          "Lấy bài viết theo danh mục thất bại!",
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }

  public async getAllPostByRank(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { _gte, _lte } = req.body;
    const missingFields = [];
    if (!_gte) missingFields.push("_gte");
    if (!_lte) missingFields.push("_lte");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Get post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    const gte = _gte > 0 ? parseInt(_gte) : 1;
    const lte = _lte <= 100 ? parseInt(_lte) : 5;

    try {
      const posts = await postService.getAllByRank(gte, lte);
      if (!posts) {
        return next(
          new BadRequestError("Không có bài viết nào!", "POST_NOT_FOUND")
        );
      }
      return res.status(200).json({
        message: "Lấy bài viết theo rank thành công",
        data: posts,
      });
    } catch (error) {
      logError("get-post", "getAllPostByRank fail", error);
      return next(
        new ServerError(
          "Lấy bài viết theo rank thất bại!",
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }

  public async getAllPostByViewPublished(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { page, limit } = req.query;
    const missingFields = [];
    if (!page) missingFields.push("page");
    if (!limit) missingFields.push("limit");

    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Get post fail, missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }
    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 80 ? parseInt(limit as string) : 10;

    try {
      const posts = await postService.getAllByViewPublished(_page, _limit);
      if (!posts) {
        return next(
          new BadRequestError("Không có bài viết nào!", "POST_NOT_FOUND")
        );
      }
      return res.status(200).json({
        message: "Lấy bài viết theo view thành công",
        data: posts,
      });
    } catch (error) {
      logError("get-post", "getAllPostByView fail", error);
      return next(
        new ServerError(
          "Lấy bài viết theo view thất bại!",
          "INTERNAL_SERVER_ERROR"
        )
      );
    }
  }

  public async getAllRecentPublishedByAuthor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { authorId } = req.body;
    const { page, limit } = req.query;

    const missingFields = [];
    if (!authorId) missingFields.push("authorId");

    if (missingFields.length > 0) {
      return next(
        new JoiRequestValidationError(
          req.t("validation.missing-parameter"),
          "MISSING_FIELDS"
        )
      );
    }

    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 80 ? parseInt(limit as string) : 80;

    try {
      const posts = await postService
        .getAllRecentPublishedByAuthor({
          page: _page,
          limit: _limit,
          authorId: authorId,
        })
        .catch((error) => {
          logError("get-post", "getAllRecentPublishedByAuthor fail", error);
          return next(
            parseMongoError(error, req.t("modules.post.get.by-author.error"))
          );
        });

      const totalPosts = await postService.getCountAllRecentPublishedByAuthor(
        authorId
      );
      const totalPages = Math.ceil(totalPosts / _limit);

      return res.status(200).json({
        message: req.t("modules.post.get.by-author.success"),
        data: posts,
        currentPage: _page,
        totalPages,
        totalPosts,
      });
    } catch (error) {
      logError("get-post", "getAllRecentPublishedByAuthor fail", error);
      return next(new ServerError(req.t("modules.post.get.by-author.error")));
    }
  }
}
