import { Application } from "express";
import express from "express";

import { sessionRoutes } from "./modules/session/routes/sessionRoutes";
import { roleRoutes } from "./modules/role/routes/roleRoutes";
import { authRoutes } from "./modules/auth/routes/authRoutes";
import { userRoutes } from "./modules/user/routes/userRoutes";
import { tagRoutes } from "@/modules/tag/routes/tagRoutes";
import { postRoutes } from "@/modules/post/routes/postRoutes";
import { mailRoutes } from "@/modules/mail/routes/mailRoutes";
import { chatRoutes } from "@/modules/chat/routes/chatRoutes";

import { webRoutes } from "@/modules/web/routes/webRoutes";

import { uploadImageRoutes } from "@/modules/s3/routes/s3ImageRoutes";
import { uploadVideoRoutes } from "@/modules/s3/routes/s3VideoRoutes";
import { s3Routes } from "@/modules/s3/routes/s3Routes";

const BASE_PATH_V1 = "/api/v1";
// const BASE_PATH_V2 = "/api/v2";

export default (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH_V1, sessionRoutes.index());
    app.use(BASE_PATH_V1, roleRoutes.index());
    app.use(BASE_PATH_V1, authRoutes.index());
    app.use(BASE_PATH_V1, userRoutes.index());
    app.use(BASE_PATH_V1, tagRoutes.index());
    app.use(BASE_PATH_V1, postRoutes.index());
    app.use(BASE_PATH_V1, mailRoutes.index());
    app.use(BASE_PATH_V1, chatRoutes.index());

    app.use(BASE_PATH_V1, webRoutes.index());

    app.use(BASE_PATH_V1, uploadImageRoutes.index());
    app.use(BASE_PATH_V1, uploadVideoRoutes.index());
    app.use(BASE_PATH_V1, s3Routes.index());
  };
  routes();
};
