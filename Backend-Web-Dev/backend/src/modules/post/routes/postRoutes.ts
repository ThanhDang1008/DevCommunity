import express, { Router } from "express";

import { CreatePost } from "../controller/create-post";
import { UpdatePost } from "../controller/update-post";
import { DeletePost } from "../controller/delete-post";
import { GetPost } from "../controller/get-post";

import { CreatePostComments } from "../controller/PostComments/create";
import { GetPostComments } from "../controller/PostComments/get";
import { DeletePostComments } from "../controller/PostComments/delete";
import { UpdatePostComments } from "../controller/PostComments/update";

import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { verifySignature } from "@/shared/middleware/verifySignature.middleware";
import { Role } from "@/constants/common";

class PostRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/post", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.get("/:slug", GetPost.prototype.getPostBySlug);
    this.router.post("/recent/public", GetPost.prototype.getAllRecentPublished);
    this.router.post(
      "/recent/public/author",
      GetPost.prototype.getAllRecentPublishedByAuthor
    );
    this.router.post(
      "/category/public",
      GetPost.prototype.getAllPostByCategoryPublished
    );
    this.router.post(
      "/view/public",
      GetPost.prototype.getAllPostByViewPublished
    );
    this.router.patch("/increase-view", UpdatePost.prototype.increaseViewPost);
    this.router.post("/rank", GetPost.prototype.getAllPostByRank);

    this.router.patch(
      "/rank",
      authAuthMiddleware([Role.ROOT]),
      UpdatePost.prototype.updateRankPost
    );

    this.router.post(
      "/detail/:id",
      authAuthMiddleware([Role.ROOT, Role.ADMIN, Role.USER]),
      GetPost.prototype.getPostById
    );
    this.router.post(
      "/recent",
      authAuthMiddleware([Role.ROOT, Role.ADMIN, Role.USER]),
      GetPost.prototype.getAllRecent
    );
    this.router.post(
      "/category",
      authAuthMiddleware([Role.ROOT, Role.ADMIN]),
      GetPost.prototype.getAllPostByCategory
    );
    //----------------------------------------------

    this.router.post(
      "/",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      CreatePost.prototype.create
    );
    this.router.patch(
      "/",
      authAuthMiddleware(Object.values(Role)),
      UpdatePost.prototype.update
    );
    this.router.patch(
      "/reaction",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      UpdatePost.prototype.updateReactionPost
    );
    this.router.patch(
      "/shared",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      UpdatePost.prototype.updateSharedByListUserId
    );
    this.router.delete(
      "/:_id",
      authAuthMiddleware(Object.values(Role)),
      DeletePost.prototype.deleteById
    );
    //------------------ Post Comments Routes ------------------
    this.router.post(
      "/comments",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      CreatePostComments.prototype.handle
    );
    this.router.patch(
      "/comments/content",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      UpdatePostComments.prototype.update
    );
    this.router.patch(
      "/comments/reaction",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      UpdatePostComments.prototype.updateReaction
    );
    this.router.get(
      "/comments/:postId",
      //authAuthMiddleware(Object.values(Role)),
      GetPostComments.prototype.getAll
    );
    this.router.get(
      "/comments/reply/:postId/:commentId",
      //authAuthMiddleware(Object.values(Role)),
      GetPostComments.prototype.getAllReply
    );
    this.router.delete(
      "/comments/delete",
      authAuthMiddleware(Object.values(Role)),
      DeletePostComments.prototype.handle
    );
    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
