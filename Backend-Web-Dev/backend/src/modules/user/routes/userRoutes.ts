import express, { Router } from "express";

import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { verifySignature } from "@/shared/middleware/verifySignature.middleware";

import { ValidateCreateFriendRequests } from "../validator/FriendRequests/create";
import { ValidateUpdateFriendRequests } from "../validator/FriendRequests/update";
import { CreateFriendRequests } from "../controller/FriendRequests/create";
import { GetFriendRequests } from "../controller/FriendRequests/get";
import { UpdateFriendRequests } from "../controller/FriendRequests/update";

import { GetUser } from "../controller/get";
import { UpdateUser } from "../controller/update";
import { CreateUser } from "../controller/create";
import { DeleteUser } from "../controller/delete";
import { Role } from "@/constants/common";

class UserRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/user", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    //-------------------- User ----------------------
    this.router.post(
      "/info",
      authAuthMiddleware(Object.values(Role)),
      GetUser.prototype.infoMe
    );
    this.router.post(
      "/info-user",
      verifySignature(),
      GetUser.prototype.infoUser
    );
    this.router.patch(
      "/",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      UpdateUser.prototype.info
    );

    this.router.post(
      "/set-info",
      verifySignature(),
      authAuthMiddleware([Role.ROOT]),
      UpdateUser.prototype.setInfo
    );
    this.router.post(
      "/create",
      verifySignature(),
      authAuthMiddleware([Role.ROOT]),
      CreateUser.prototype.handle
    );

    this.router.get(
      "/list",
      authAuthMiddleware([Role.ROOT, Role.ADMIN]),
      GetUser.prototype.list
    );
    this.router.get(
      "/list-friends",
      authAuthMiddleware(Object.values(Role)),
      GetUser.prototype.listFriends
    );
    this.router.get(
      "/recommend-friends",
      authAuthMiddleware(Object.values(Role)),
      GetUser.prototype.recommendFriends
    );

    this.router.delete(
      "/delete",
      verifySignature(),
      authAuthMiddleware([Role.ROOT]),
      DeleteUser.prototype.handle
    );
    //-------------------- Friend Requests --------------------
    this.router.post(
      "/friend-requests",
      authAuthMiddleware(Object.values(Role)),
      ValidateCreateFriendRequests.prototype.create,
      CreateFriendRequests.prototype.send
    );
    this.router.get(
      "/friend-requests/sender",
      authAuthMiddleware(Object.values(Role)),
      GetFriendRequests.prototype.getAllBySenderId
    );
    this.router.get(
      "/friend-requests/receiver",
      authAuthMiddleware(Object.values(Role)),
      GetFriendRequests.prototype.getAllByReceiverId
    );
    this.router.patch(
      "/friend-requests/:friendRequestId",
      authAuthMiddleware(Object.values(Role)),
      ValidateUpdateFriendRequests.prototype.feedback,
      UpdateFriendRequests.prototype.feedback
    );
    this.router.delete(
      "/friend-requests/:friendRequestId",
      authAuthMiddleware(Object.values(Role)),
      ValidateUpdateFriendRequests.prototype.cancel,
      UpdateFriendRequests.prototype.cancel
    );

    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
