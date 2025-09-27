import express, { Application, Response, Request, NextFunction } from "express";
import http from "http"; //hoặc import { createServer } from "http"___const httpServer = createServer();
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import {
  CustomError,
  IErrorResponse,
} from "@/shared/globals/exceptions/error-handler";
import { config } from "./config.app";
import { initFolder } from "@/shared/utils/initFolder";
import { logError } from "@/shared/utils/log";
import logger from "@/shared/utils/log/logger";
import i18n from "@/shared/utils/language/i18n";
import configCors from "@/config/cors";
import applicationRoutes from "./routes.app";

import { SocketIOAuthHandler } from "@modules/auth/events/authEvents";
import { SocketIOChatHandler } from "@modules/chat/events/chatEvents";
import { SocketIOPostHandler } from "@/modules/post/events/PostComments/postEvents";

export class RunServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.initFolderAndFile();
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.i18nMiddleware(this.app);
    this.loggerMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private async initFolderAndFile(): Promise<void> {
    const FOLDER_UPLOAD = "./upload";
    const FOLDER_UPLOAD_IMAGE = "./upload/image";
    const FOLDER_UPLOAD_VIDEO = "./upload/video";
    const FOLDER_UPLOAD_FILE = "./upload/file";
    const FOLDER_UPLOAD_TRASH = "./upload/trash";
    initFolder(FOLDER_UPLOAD);
    initFolder(FOLDER_UPLOAD_IMAGE);
    initFolder(FOLDER_UPLOAD_VIDEO);
    initFolder(FOLDER_UPLOAD_TRASH);
    initFolder(FOLDER_UPLOAD_FILE);
  }

  private securityMiddleware(app: Application): void {
    app.use(configCors);
    app.use(cookieParser());
  }

  private standardMiddleware(app: Application): void {
    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ extended: true, limit: "100mb" }));
  }

  private i18nMiddleware(app: Application): void {
    app.use((req: Request, res: Response, next: NextFunction) => {
      const lang = req.cookies["lang"] || req.headers["accept-language"];
      if (lang) {
        //res.cookie("lang", lang, { maxAge: 900000, httpOnly: true });
        i18n.setLocale(req, lang);
      } else {
        i18n.setLocale(req, "vi");
      }
      next();
    });
    app.use(i18n.init);
  }

  private loggerMiddleware(app: Application): void {
    app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - start;
        const logMessageInfo = `${req.method} ${res.statusCode} ${req.originalUrl} (${duration}ms)`;

        if (res.statusCode >= 200 && res.statusCode < 400) {
          logger.info(logMessageInfo);
        }
      });

      next();
    });
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res.status(404).json({
        message: `method:${req.method}, path:${req.originalUrl} not found!`,
        status: "NOT_FOUND_ENDPOINT",
      });
    });

    app.use(
      (
        error: IErrorResponse,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        res.on("finish", () => {
          const serialized = error.serializeErrors();

          //const logMessageError = `${req.method} ${res.statusCode} ${req.originalUrl} [${serialized.message} - ${serialized.status}]`;
          const logMessageError = `${req.method} ${res.statusCode} ${req.originalUrl} (${serialized.message})`;
          if (res.statusCode >= 400 && res.statusCode < 500) {
            logger.warn(logMessageError, {
              _: "-------------------------------------------------------------------------------------------",
              detail: error.serializeErrors(),
              reason: error.stack,
              method: req.method,
              statusCode: res.statusCode,
              path: req.originalUrl,
              body: req.body,
              query: req.query,
              params: req.params,
              headers: req.headers,
              cookies: req.cookies,
            });
          }
          if (res.statusCode >= 500) {
            logger.error(logMessageError, {
              _: "-------------------------------------------------------------------------------------------",
              detail: error.serializeErrors(),
              reason: error.stack,
              method: req.method,
              statusCode: res.statusCode,
              path: req.originalUrl,
              body: req.body,
              query: req.query,
              params: req.params,
              headers: req.headers,
              cookies: req.cookies,
            });
          }
        });

        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
      }
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);

      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      logError("RunServer", "startServer failed", error);
      // process.exit(1); // Exit the process if server fails to start
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      pingTimeout: 60000, // 60 seconds
      pingInterval: 25000, // 25 seconds
      transports: ["websocket", "polling"], // Use WebSocket and Polling transports
      cors: {
        origin: [
          config.CLIENT_URL as string,
          config.CLIENT_URL2 as string,
          config.CLIENT_URL3 as string,
          config.CLIENT_URL4 as string,
        ],
        credentials: true, // Allow cookies to be sent with requests
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });
    //https://socket.io/docs/v4/redis-adapter
    //const pubClient = createClient({ url: config.REDIS_HOST });
    //const subClient = pubClient.duplicate();
    // await Promise.all([pubClient.connect(), subClient.connect()]);
    // io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    // log.info(`Worker with process id of ${process.pid} has started...`);
    // log.info(`Server has started with process ${process.pid}`);
    httpServer.listen(config.PORT, () => {
      // log.info(`Server running on port ${config.PORT}`);
      console.log(
        "\x1b[35m%s\x1b[0m",
        `Server is running on`,
        `http://${config.HOST}:${config.PORT}`
      );
      console.log(
        "\x1b[35m%s\x1b[0m",
        `Server socket is running on`,
        `http://${config.HOST}:${config.PORT}`
      );
    });
  }

  private socketIOConnections(io: Server): void {
    const authNamespace = io.of("/socket/v1/auth");
    const chatNamespace = io.of("/socket/v1/chat");
    const postCommentNamespace = io.of("/socket/v1/post");

    const authSocketHandler: SocketIOAuthHandler = new SocketIOAuthHandler(
      authNamespace
    );
    const chatSocketHandler: SocketIOChatHandler = new SocketIOChatHandler(
      chatNamespace
    );
    const postCommentSocketHandler: SocketIOPostHandler =
      new SocketIOPostHandler(postCommentNamespace);

    authSocketHandler.listen();
    chatSocketHandler.listen();
    postCommentSocketHandler.listen();
  }
}
