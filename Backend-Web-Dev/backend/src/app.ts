import express, { Express } from "express";

import { config } from "./config.app";
import { RunServer } from "./setupServer";
import { connectionToDatabase } from "./setupDatabase";
import { logError } from "./shared/utils/log";

class Application {
  public initialize(): void {
    connectionToDatabase.db();
    //-----------------------------
    const app: Express = express();
    const server: RunServer = new RunServer(app);
    server.start();
    //Application.handleExit();
  }

  private static handleExit(): void {
    process.on("uncaughtException", (error: Error) => {
      logError("app", "Uncaught Exception", error);
      Application.shutDownProperly(1);
    });

    process.on("unhandleRejection", (reason: Error) => {
      logError("app", "Unhandled Rejection", reason);
      Application.shutDownProperly(2);
    });

    process.on("SIGTERM", () => {
      Application.shutDownProperly(2);
    });

    process.on("SIGINT", () => {
      Application.shutDownProperly(2);
    });

    process.on("exit", () => {});
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        process.exit(exitCode);
      })
      .catch((error) => {
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initialize();
