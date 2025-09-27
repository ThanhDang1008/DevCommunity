import {
  S3Client,
  DeleteObjectsCommand,
  DeleteObjectsRequest,
} from "@aws-sdk/client-s3";

import { config } from "@/config.app";
import { logError } from "@/shared/utils/log";
import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";
import { s3Service } from "@/modules/s3/service/s3.service";

// Dành cho xoá bài post
export const deleteMultipleVideos = async (link: string[]) => {
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
  if (link.length === 0) {
    return;
  }
  try {
    const keys = link.map((item) => {
      return {
        Key: `video/${item.split("/").pop()}`,
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

    //---------------- delete in db ------------------
    s3Service.deleteMultipleByUrl(link);

    //console.log("Xóa nhiều video thành công: ", response.Deleted);
    console.log(
      "✅ " +
        formatToLocalDateTime(new Date().toISOString()) +
        ` - ☁️  Delete multiple video s3: ${keys.length} videos`
    );

    return response;
  } catch (error) {
    logError("deleteMultipleVideos", "Delete vdieo error", error);
    //throw error;
  }
};
