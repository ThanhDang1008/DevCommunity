import { createLogger, transports, format } from "winston";
import LokiTransport from "winston-loki";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, json, printf, errors, prettyPrint } = format;

const logger = createLogger({
  transports: [
    new DailyRotateFile({
      filename: "logs/info-%DATE%.log", // Ví dụ: logs/2025-05-12.log
      datePattern: "DD-MM-YYYY",
      zippedArchive: true, // nén file cũ
      // maxSize: "20m",
      maxFiles: "3d", // giữ lại 3 ngày
      level: "info",
      format: combine(
        timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
    }),
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log", // Ví dụ: logs/2025-05-12.log
      datePattern: "DD-MM-YYYY",
      zippedArchive: true, // nén file cũ
      // maxSize: "20m",
      maxFiles: "3d", // giữ lại 3 ngày
      level: "error",
      format: combine(
        errors({ stack: true }),
        timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        json(),
        prettyPrint()
      ),
    }),
    new DailyRotateFile({
      filename: "logs/warn-%DATE%.log", // Ví dụ: logs/2025-05-12.log
      datePattern: "DD-MM-YYYY",
      zippedArchive: true, // nén file cũ
      // maxSize: "20m",
      maxFiles: "3d", // giữ lại 3 ngày
      level: "warn",
      format: combine(
        errors({ stack: true }),
        timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        json(),
        prettyPrint()
      ),
    }),
  ],
});

export default logger;
