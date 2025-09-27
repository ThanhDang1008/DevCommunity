import { Request, Response, NextFunction } from "express";

import { sessionService } from "@/modules/session/service/session.service";
import { userService } from "@/modules/user/service/user.service";
import { config } from "@/config.app";
import { verifyToken, TokenStatus } from "@/shared/globals/helpers/jwt.auth";
import {
  BadRequestError,
  ServerError,
} from "@/shared/globals/exceptions/error-handler";
import { logError } from "@/shared/utils/log";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";
// import { authCache } from "@service/redis/auth.cache";

export class GetUser {
  public async infoMe(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      (req.headers["session"] as string) || "{}"
    ) as ReqHeaderSession;

    try {
      const data = await userService
        .getUserById(session.id_user)
        .catch((error) => {
          return next(
            new ServerError("Get data user failed", "GET_DATA_USER_ERROR")
          );
        });

      if (!data) {
        return next(new BadRequestError("User not found", "USER_NOT_FOUND"));
      }

      if (data) {
        return res.status(200).json({
          message: "Lấy thông tin thành công",
          data: data,
        });
      }
    } catch (error) {
      logError("get-user", "info fail", error);
      return next(new ServerError("Lấy thông tin thất bại"));
    }
  }

  public async infoUser(req: Request, res: Response, next: NextFunction) {
    const { authorId } = req.body;

    try {
      const data = await userService.getUserById(authorId).catch((error) => {
        return next(
          new ServerError("Get data user failed", "GET_DATA_USER_ERROR")
        );
      });

      if (!data) {
        return next(new BadRequestError("User not found", "USER_NOT_FOUND"));
      }

      if (data) {
        return res.status(200).json({
          message: "Lấy thông tin thành công",
          data: data,
        });
      }
    } catch (error) {
      logError("get-user", "infoUser fail", error);
      return next(new ServerError("Lấy thông tin thất bại"));
    }
  }

  public async list(req: Request, res: Response, next: NextFunction) {
    const { page, limit } = req.query;
    const _page = parseInt(page as string) || 1;
    const _limit =
      parseInt(limit as string) <= 80 ? parseInt(limit as string) : 10;
    try {
      const data = await userService
        .getAll(_page, _limit, {
          sort: {
            createdAt: "desc", // sắp xếp theo ngày tạo mới nhất
          },
        })
        .catch((error) => {
          return next(
            new ServerError(
              req.t("modules.user.get-all.error"),
              "GET_DATA_USERS_ERROR"
            )
          );
        });

      if (!data) {
        return next(
          new BadRequestError(
            req.t("modules.user.get-all.not-found"),
            "NO_USERS_FOUND"
          )
        );
      }

      const totalUsers = await userService.getCountAll().catch((error) => {
        return next(
          new ServerError(
            req.t("modules.user.get-all.error"),
            "GET_COUNT_USERS_ERROR"
          )
        );
      });

      const totalPages = Math.ceil(totalUsers / _limit);

      return res.status(200).json({
        message: req.t("modules.user.get-all.success"),
        data: data,
        currentPage: _page,
        totalPages,
        totalUsers,
      });
    } catch (error) {
      logError("get-user", "list fail", error);
      return next(new ServerError(req.t("modules.user.get-all.error")));
    }
  }

  public async listFriends(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    try {
      const data = await userService
        .getListFriends(session.id_user)
        .catch((error) => {
          return next(
            new ServerError(req.t("modules.user.get.list-friends.error"))
          );
        });

      if (!data) {
        return next(
          new BadRequestError(
            req.t("modules.user.get.list-friends.not-found"),
            "NO_FRIENDS_FOUND"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.user.get.list-friends.success"),
        data: data,
      });
    } catch (error) {
      logError("get-user", "listFriends fail", error);
      return next(
        new ServerError(req.t("modules.user.get.list-friends.error"))
      );
    }
  }

  public async recommendFriends(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    const { page, limit } = req.query;

    const _limit =
      parseInt(limit as string) <= 80 ? parseInt(limit as string) : 10;
    const _page = parseInt(page as string) || 1;

    try {
      const data = await userService
        .getRandomUsersNotInFriendList({
          limit: _limit,
          page: _page,
          userId: session.id_user,
        })
        .catch((error) => {
          logError("get-user", "recommendFriends error", error);
          return next(parseMongoError(error));
        });

      if (!data) {
        return next(
          new BadRequestError(
            req.t("modules.user.get.recommend-friends.not-found"),
            "NO_RECOMMEND_FRIENDS_FOUND"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.user.get.recommend-friends.success"),
        data: data,
      });
    } catch (error) {
      logError("get-user", "recommendFriends fail", error);
      return next(
        new ServerError(req.t("modules.user.get.recommend-friends.error"))
      );
    }
  }
}
