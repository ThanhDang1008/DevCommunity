import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";
import logger from "@/shared/utils/log/logger";
import { config } from "@/config.app";

export const logError = (name: string, message: string, error: any) => {
  // if (config.NODE_ENV === "development") {
    console.group();
    console.log(
      `❌ ${formatToLocalDateTime(new Date().toISOString())} - ${message}`
    );
    console.log("Name: ", name);
    console.log("Reason: ", error);
    console.groupEnd();
    return;
  // }
  // return;
};

export const logInfo = (message: string, ...args: any[]) => {
  if (config.NODE_ENV === "development") {
    console.group();
    console.log(
      `✅ ${formatToLocalDateTime(new Date().toISOString())} - ${message}`,
      ...args
    );
    console.groupEnd();
    return;
  }
  return;
};

export const logSuccess = (message: string, ...args: any[]) => {
  if (config.NODE_ENV === "development") {
    console.group();
    console.log(
      `✅ ${formatToLocalDateTime(new Date().toISOString())} - ${message}`,
      ...args
    );
    console.groupEnd();
    return;
  }
  return;
};
