import {
  S3Client,
  DeleteObjectsCommand,
  DeleteObjectsRequest,
} from "@aws-sdk/client-s3";

import { config } from "@/config.app";
import { logError } from "@/shared/utils/log";
import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";

export const deleteMultipleFile = async (keyFile: string[]) => {
  const s3 = new S3Client({
    endpoint: config.CLOUDFLARE_R2_ENDPOINT,
    region: "apac", //wnam, enam, weur, eeur, apac, oc, auto
    credentials: {
      accessKeyId: config.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: config.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // Cần thiết cho các dịch vụ S3-compatible
    //signatureVersion: "v4", // Một số dịch vụ cần chữ ký v4
  });
  if (keyFile.length === 0) {
    return;
  }
  try {
    const keys = keyFile.map((item) => {
      return {
        Key: item,
      };
    });

    //console.log("keys: ", keys);

    const params: DeleteObjectsRequest = {
      Bucket: config.CLOUDFLARE_R2_BUCKET_NAME,
      Delete: {
        Objects: keys,
        Quiet: false, // Nếu true, không trả về danh sách các key đã xóa
      },
    };

    const command = new DeleteObjectsCommand(params);
    const response = await s3.send(command);

    //console.log("Xóa nhiều ảnh thành công: ", response.Deleted);
    console.log(
      "✅ " +
        formatToLocalDateTime(new Date().toISOString()) +
        ` - ☁️  Delete multiple file s3: ${keys.length} files`
    );

    return response;
  } catch (error) {
    logError("deleteMultipleFile", "Delete file error", error);
    //throw error;
  }
};
