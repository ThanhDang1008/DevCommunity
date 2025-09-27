import fs from "fs";
import { logError as logErrorSys } from "@/shared/utils/log";

export const initFile = async (path: string, content?: any) => {
  try {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(
        path,
        content ? JSON.stringify(content, null, 2) : "",
        "utf-8"
      );
      console.log(
        `--------------- Create file: ${path} success! ---------------`
      );
    }
  } catch (error) {
    logErrorSys("initFile", `Create file: ${path} fail!`, error);
  }
};

export type ErrorDeleteFile = {
  message: string;
  error?: any;
};

// export const deleteFile = (
//   filePath: string
// ): Promise<boolean | ErrorDeleteFile> => {
//   return new Promise((resolve, reject) => {
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         // ❌ File không tồn tại
//         if (err.code === "ENOENT") {
//           logErrorSys("deleteFile", `File not found: ${filePath}`, err);
//           return reject({ message: "File not found!" });
//         }
//         // ❌ Xảy ra lỗi quyền (thử đổi quyền & xóa lại)
//         else if (err.code === "EPERM") {
//           fs.chmod(filePath, 0o666, (chmodErr) => {
//             if (chmodErr) {
//               logErrorSys(
//                 "deleteFile",
//                 `Change permission failed for file: ${filePath}`,
//                 chmodErr
//               );
//               return reject({ message: "Permission error!", error: chmodErr });
//             }
//             // Thử xóa lại sau khi đổi quyền
//             fs.unlink(filePath, (unlinkErr) => {
//               if (unlinkErr) {
//                 logErrorSys(
//                   "deleteFile",
//                   `Delete file after permission change failed: ${filePath}`,
//                   unlinkErr
//                 );
//                 return reject({
//                   message: "Delete file fail!",
//                   error: unlinkErr,
//                 });
//               }
//               console.log(
//                 `--------------- Delete file: ${filePath} success ---------------`
//               );
//               return resolve(true);
//             });
//             //--------------------------
//           });
//         } else {
//           // ❌ Các lỗi khác
//           logErrorSys("deleteFile", `Delete file failed: ${filePath}`, err);
//           return reject({ message: "Delete file fail!", error: err });
//         }
//       } else {
//         console.log(
//           `--------------- Delete file: ${filePath} success ---------------`
//         );
//         return resolve(true);
//       }
//     });
//   });
// };

export const deleteFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      // Xóa file nếu tồn tại
      fs.unlinkSync(filePath);
      console.log(
        `--------------- Delete file: ${filePath} success ---------------`
      );
    }
  } catch (error) {
    logErrorSys("deleteFile", `Delete file failed: ${filePath}`, error);
  }
};
