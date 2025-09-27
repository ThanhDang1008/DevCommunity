import { Request, Response, NextFunction } from "express";
import readline from "readline";
import fs from "fs";
import path from "path";

import { logError } from "@/shared/utils/log";
import {
  ServerError,
  BadRequestError,
} from "@/shared/globals/exceptions/error-handler";
import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";
import { config } from "@/config.app";

export class Logger {
  public async info(req: Request, res: Response, next: NextFunction) {
    const fileName = req.query.fileName as string;
    const lines = parseInt(req.query.lines as string) || 100;

    const missingFields = [];
    if (!fileName) {
      missingFields.push("fileName");
    }
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Missing fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        )
      );
    }

    const logPath = path.join("./logs", fileName);

    try {
    const fileStream = fs.createReadStream(logPath, { encoding: "utf-8" });

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const buffer: string[] = [];

    for await (const line of rl) {
      buffer.push(line);
      if (buffer.length > lines) {
        buffer.shift(); // giữ lại dòng mới nhất
      }
    }


    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).end(buffer.join("\n"));
    } catch (error) {
      logError("logger", "get logger fail", error);
      return next(new ServerError("Error get logger", "INTERNAL_SERVER_ERROR"));
    }
  }
}
