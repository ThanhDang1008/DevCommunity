import { mkdir } from "node:fs/promises";
import fs from "fs";
import { logError as logErrorSys, logSuccess } from "@/shared/utils/log";
import { exec } from "child_process";

export const initFolder = async (path: string) => {
  try {
    if (!fs.existsSync(path)) {
      await mkdir(path, { recursive: true });
      console.log(
        `--------------- Create folder: ${path} success ---------------`
      );
    }
  } catch (error) {
    logErrorSys("initFolder", `Create folder: ${path} fail`, error);
  }
};

export const deleteFolder = (path: string) => {
  try {
    if (fs.existsSync(path)) {
      fs.rmSync(path, { recursive: true, force: true });
      console.log(
        `--------------- Delete folder: ${path} success ---------------`
      );
    }
  } catch (error) {
    logErrorSys("deleteFolder", `Delete folder: ${path} fail`, error);
  }
};

export const deleteFolderProcess = async (path: string) => {
  try {
    if (fs.existsSync(path)) {
      // Xác định lệnh dựa trên hệ điều hành
      let command: string;
      if (process.platform === "win32") {
        // Trên Windows, dùng rmdir /S /Q
        // Đảm bảo đường dẫn được đặt trong dấu ngoặc kép để xử lý khoảng trắng nếu có
        command = `rmdir /S /Q "${path}"`;
      } else {
        // Trên Linux/macOS, dùng rm -rf
        // Đảm bảo đường dẫn được đặt trong dấu ngoặc kép để xử lý khoảng trắng nếu có
        command = `rm -rf "${path}"`;
      }

      console.log(`Attempting to execute command: ${command}`);

      // Sử dụng Promise để biến hàm exec bất đồng bộ thành async/await
      await new Promise<void>((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            // console.error(
            //   `Error executing command to delete folder: ${error.message}`
            // );
            logErrorSys(
              "deleteFolderProcess",
              `Error executing command to delete folder: ${error.message}`,
              error
            );
            // Bao gồm stderr và stdout trong lỗi để dễ debug hơn
            // reject(
            //   new Error(
            //     `Failed to delete folder '${path}': ${error.message}\nStderr: ${stderr}\nStdout: ${stdout}`
            //   )
            // );
            return;
          }
          if (stderr) {
            //console.warn(`Stderr output during folder deletion: ${stderr}`);
            // Thường thì stderr có thể là cảnh báo, không nhất thiết là lỗi
            // Tuy nhiên, nếu bạn muốn coi stderr là lỗi, hãy reject ở đây
            logErrorSys(
              "deleteFolderProcess",
              `Stderr output during folder deletion: ${stderr}`,
              new Error(stderr)
            );
          }
          console.log(
            `--------------- Delete folder: ${path} success ---------------`
          );
          // resolve();
        });
      });
    }
  } catch (error) {
    logErrorSys("deleteFolderProcess", `Delete folder: ${path} fail`, error);
  }
};
